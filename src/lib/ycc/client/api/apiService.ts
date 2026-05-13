import {
  CreateCommentRequestSchema,
  UpdateCommentRequestSchema,
  FormalChallengeResponseSchema,
  GetCommentsResponseSchema,
  AdminLoginRequestSchema,
  AdminLoginResponseSchema,
  CreateCommentResponseSchema,
  type CreateCommentResponse,
  type GetCommentsResponse,
  type AdminLoginResponse,
} from '../../shared/index.ts';
import { solvePrePow, solvePow } from '../utils/pow';

export interface ApiService {
  getComments: (post: string, isAdmin?: boolean) => Promise<GetCommentsResponse>;
  addComment: (
    post: string,
    nickname: string | undefined,
    msg: string,
    replyTo?: string,
    emoji?: string,
  ) => Promise<CreateCommentResponse | null>;
  updateComment: (
    id: string,
    post: string,
    nickname: string,
    msg: string,
    emoji?: string,
    token?: string,
    timestamp?: number,
  ) => Promise<boolean>;
  deleteComment: (id: string, post: string, token: string, timestamp: number) => Promise<boolean>;
  likeComment: (id: string, post: string) => Promise<number | null>;
  unlikeComment: (id: string, post: string) => Promise<number | null>;
  adminLogin: (username: string, password: string) => Promise<AdminLoginResponse | null>;
  checkAdminAuth: () => Promise<boolean>;
  adminLogout: () => Promise<boolean>;
}

export const createApiService = (
  apiUrl: string,
  prePowDifficulty: number,
  prePowSalt: string,
): ApiService => {
  const getFormalChallenge = async (challenge: string, nonce: number): Promise<string | null> => {
    try {
      const url = new URL('/api/pow/formal-challenge', apiUrl);
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ challenge, nonce }),
      });

      if (res.status === 400) {
        return null;
      }

      if (!res.ok) {
        throw new Error('Failed to get formal challenge');
      }

      const data = await res.json();
      return FormalChallengeResponseSchema.parse(data).challenge;
    } catch (err) {
      console.error('Failed to get formal challenge', err);
      return null;
    }
  };

  const getComments = async (post: string, isAdmin = false): Promise<GetCommentsResponse> => {
    try {
      const url = new URL('/api/comments', apiUrl);
      url.searchParams.set('post', post);
      if (isAdmin) url.searchParams.set('admin', 'true');

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch comments');

      const data = await res.json();
      return GetCommentsResponseSchema.parse(data);
    } catch (err) {
      console.error('Failed to get comments', err);
      return { comments: [], isAdmin: false };
    }
  };

  const addComment = async (
    post: string,
    nickname: string | undefined,
    msg: string,
    replyTo?: string,
    emoji?: string,
  ): Promise<CreateCommentResponse | null> => {
    try {
      const prePow = await solvePrePow(prePowDifficulty, prePowSalt);
      if (prePow.nonce < 0) {
        return null;
      }

      const fChallenge = await getFormalChallenge(prePow.challenge, prePow.nonce);
      if (!fChallenge) {
        return null;
      }

      const difficulty = parseInt(fChallenge.split(':')[2], 10);
      const nonce = await solvePow(difficulty, `${fChallenge}:${post}`);

      const req = CreateCommentRequestSchema.parse({
        nickname: nickname,
        msg,
        replyTo,
        emoji,
      });

      const url = new URL('/api/comments', apiUrl);
      url.searchParams.set('post', post);
      url.searchParams.set('challenge', fChallenge);
      url.searchParams.set('nonce', nonce.toString());
      console.log('POST URL:', url.toString());
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-PoW-Challenge': fChallenge,
          'X-PoW-Nonce': nonce.toString(),
        },
        body: JSON.stringify(req),
      });

      if (!res.ok) {
        throw new Error(`Failed to add comment: ${res.status}`);
      }

      const data = await res.json();
      console.log('addComment raw result:', data);
      return CreateCommentResponseSchema.parse(data);
    } catch (err) {
      console.error('Failed to add comment', err);
      return null;
    }
  };

  const updateComment = async (
    id: string,
    post: string,
    nickname: string,
    msg: string,
    emoji?: string,
    token?: string,
    timestamp?: number,
  ): Promise<boolean> => {
    try {
      const req = UpdateCommentRequestSchema.parse({
        nickname: nickname,
        msg,
        emoji,
      });

      const url = new URL(`/api/comments/${id}`, apiUrl);
      url.searchParams.set('post', post);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token && timestamp) {
        headers['x-comment-token'] = token;
        headers['x-comment-timestamp'] = timestamp.toString();
      }

      const res = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(req),
      });

      return res.ok;
    } catch (err) {
      console.error('Failed to update comment', err);
      return false;
    }
  };

  const deleteComment = async (id: string, post: string, token: string, timestamp: number): Promise<boolean> => {
    try {
      const url = new URL(`/api/comments/${id}`, apiUrl);
      url.searchParams.set('post', post);
      console.log('DELETE URL:', url.toString());

      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'x-comment-token': token,
          'x-comment-timestamp': timestamp.toString(),
        },
      });

      return res.ok;
    } catch (err) {
      console.error('Failed to delete comment', err);
      return false;
    }
  };

  const likeComment = async (id: string, post: string): Promise<number | null> => {
    try {
      const url = new URL(`/api/comments/${id}/like`, apiUrl);
      url.searchParams.set('post', post);
      const res = await fetch(url, { method: 'PATCH' });
      if (!res.ok) return null;
      const data = await res.json() as { likes: number };
      return data.likes;
    } catch (err) {
      console.error('Failed to like comment', err);
      return null;
    }
  };

  const unlikeComment = async (id: string, post: string): Promise<number | null> => {
    try {
      const url = new URL(`/api/comments/${id}/like`, apiUrl);
      url.searchParams.set('post', post);
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) return null;
      const data = await res.json() as { likes: number };
      return data.likes;
    } catch (err) {
      console.error('Failed to unlike comment', err);
      return null;
    }
  };

  const adminLogin = async (
    username: string,
    password: string,
  ): Promise<AdminLoginResponse | null> => {
    try {
      const req = AdminLoginRequestSchema.parse({ username, password });
      const url = new URL('/api/admin/login', apiUrl);
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      });

      if (!res.ok) return null;

      const data = await res.json();
      return AdminLoginResponseSchema.parse(data);
    } catch (err) {
      console.error('Admin login failed', err);
      return null;
    }
  };

  const checkAdminAuth = async (): Promise<boolean> => {
    try {
      const url = new URL('/api/admin/check', apiUrl);
      const res = await fetch(url);
      return res.ok;
    } catch (err) {
      console.error('Auth check failed', err);
      return false;
    }
  };

  const adminLogout = async (): Promise<boolean> => {
    try {
      const url = new URL('/api/admin/logout', apiUrl);
      const res = await fetch(url, { method: 'POST' });
      return res.ok;
    } catch (err) {
      console.error('Logout failed', err);
      return false;
    }
  };

  return {
    getComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    unlikeComment,
    adminLogin,
    checkAdminAuth,
    adminLogout,
  };
};

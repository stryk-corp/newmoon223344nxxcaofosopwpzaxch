'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  type DocumentReference,
  type DocumentData,
  type FirestoreError,
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

interface UseDocOptions<T> {
  onError?: (error: FirestoreError) => void;
}

export function useDoc<T = DocumentData>(
  ref: DocumentReference<T> | null,
  options?: UseDocOptions<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      setData(null);
      return;
    }

    const unsubscribe = onSnapshot(
      ref,
      (doc) => {
        if (doc.exists()) {
          setData({ ...doc.data(), id: doc.id } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      async (err) => {
        setError(err);
        setLoading(false);
        if (options?.onError) {
            options.onError(err);
        } else {
            const permissionError = new FirestorePermissionError({
                path: ref.path,
                operation: 'get',
            });
            errorEmitter.emit('permission-error', permissionError);
        }
      }
    );

    return () => unsubscribe();
  }, [ref, options]);

  return { data, loading, error };
}

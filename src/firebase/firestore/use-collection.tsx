'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  type Query,
  type DocumentData,
  type CollectionReference,
  type FirestoreError,
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

interface UseCollectionOptions<T> {
  onError?: (error: FirestoreError) => void;
}

export function useCollection<T = DocumentData>(
  ref: CollectionReference<T> | Query<T> | null,
  options?: UseCollectionOptions<T>
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]         = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      setData([]);
      return;
    }

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const result: T[] = [];
        snapshot.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id } as T);
        });
        setData(result);
        setLoading(false);
      },
      async (err) => {
        setError(err);
        setLoading(false);
        if (options?.onError) {
          options.onError(err);
        } else {
            const permissionError = new FirestorePermissionError({
                path: 'path' in ref ? ref.path : 'N/A', // Query doesn't have a direct path property
                operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
        }
      }
    );

    return () => unsubscribe();
  }, [ref, options]);

  return { data, loading, error };
}

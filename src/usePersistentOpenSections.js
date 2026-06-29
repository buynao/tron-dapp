import { useCallback, useState } from 'react';

const readOpenSections = (storageKey) => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const cached = window.localStorage.getItem(storageKey);
    return cached ? JSON.parse(cached) : {};
  } catch (error) {
    return {};
  }
};

const writeOpenSections = (storageKey, value) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch (error) {
    // Ignore storage quota/private mode failures; the UI still works in memory.
  }
};

export function usePersistentOpenSections(storageKey) {
  const [openSections, setOpenSections] = useState(() => readOpenSections(storageKey));

  const isSectionOpen = useCallback(
    (sectionId) => Boolean(openSections[sectionId]),
    [openSections],
  );

  const setSectionOpen = useCallback(
    (sectionId, isOpen) => {
      setOpenSections((prev) => {
        const next = { ...prev, [sectionId]: isOpen };
        writeOpenSections(storageKey, next);
        return next;
      });
    },
    [storageKey],
  );

  return { isSectionOpen, setSectionOpen };
}

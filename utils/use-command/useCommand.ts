import { useCallback, useState, useMemo, useEffect } from 'react';
import { set } from 'lodash';
import { usePrevious } from 'react-use';
import type { Command, Options } from './types';

export default function useCommand<T>(values: T[], options: Options = {}) {
  const {
    maxUndo = 999,
  } = options;

  const [data, setData] = useState(values);
  const [histories, setHistories] = useState<Command[]>([]);
  const [index, setIndex] = useState(-1);
  
  const push = useCallback((command: Command) => {
    const newHistories = histories.slice(0, index + 1);
    if (newHistories.length === maxUndo) {
      newHistories.shift();
    }
    newHistories.push(command);
    setHistories(newHistories);
    setIndex(newHistories.length - 1);
  }, [index, histories, maxUndo]);

  const pop = useCallback(() => {
    const newHistories = [...histories];
    if (newHistories.length > 0) {
      newHistories.pop();
      setHistories(newHistories);
      setIndex(newHistories.length - 1);
    }
  }, [histories]);

  const jump = useCallback((n: number) => {
    let newIndex = index + n;
    if (newIndex > index) {
      newIndex = index;
    }
    if (newIndex < -1) {
      newIndex = -1;
    }
    setIndex(newIndex);
  }, [index]);

  const undo = useCallback(() => jump(-1), [jump]);

  const prevIndex = usePrevious(index);

  useEffect(() => {
    if (prevIndex !== index) {
      const newHistories = histories.slice(0, index + 1);
      const calculatedData = [...data]; 

      for (let i = 0, l = newHistories.length; i < l; i++) {
        const { coordinate, value } = newHistories[i];
        const row = Object.assign({}, calculatedData[coordinate.index]);
        set(row, coordinate.accessor, value);
        calculatedData[coordinate.index] = row;
      }
      setData(calculatedData);
    }
  }, [prevIndex, index, histories, data]);

  return useMemo(() => ({
    data,
    push,
    pop,
    jump,
    undo,
  }), [
    data,
    push,
    pop,
    jump,
    undo,
  ]);
}

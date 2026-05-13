import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { StackRenderer } from './StackRenderer';
import { StackData } from '../../types/email';

interface VirtualInboxProps {
  stacks: StackData[];
}

export const VirtualInbox: React.FC<VirtualInboxProps> = ({ stacks }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: stacks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimate height of a stack header + some rows
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-text-muted transition-colors"
      style={{ height: '100%' }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <StackRenderer stack={stacks[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};

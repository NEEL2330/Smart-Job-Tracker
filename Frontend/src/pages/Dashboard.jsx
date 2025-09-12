import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-100 text-red-800">
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <p>Error: {this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function SortableJob({ id, title }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: transform ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-2 bg-white rounded shadow-sm cursor-move border border-gray-200 hover:bg-gray-50"
      {...attributes}
      {...listeners}
    >
      <p className="text-gray-700 text-sm">{title}</p>
    </div>
  );
}

export default function Dashboard() {
  const [columns, setColumns] = useState({
    wishlist: [],
    applied: [],
    interview: [],
    offered: [],
    accepted: [],
  });

  const columnIds = Object.keys(columns);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) {
      const activeItems = columns[activeColumnId];
      const activeItemIndex = activeItems.findIndex((item) => item.id === active.id);
      const overItemIndex = activeItems.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(activeItems, activeItemIndex, overItemIndex);
      setColumns({ ...columns, [activeColumnId]: newItems });
    } else {
      const activeItems = [...columns[activeColumnId]];
      const overItems = [...columns[overColumnId]];
      const activeItemIndex = activeItems.findIndex((item) => item.id === active.id);
      const item = activeItems[activeItemIndex];
      activeItems.splice(activeItemIndex, 1);
      overItems.push(item);
      setColumns({
        ...columns,
        [activeColumnId]: activeItems,
        [overColumnId]: overItems,
      });
    }
  };

  const addJob = () => {
    const newJob = { id: Date.now().toString(), title: `Job ${Date.now()}` };
    setColumns({ ...columns, applied: [...columns.applied, newJob] });
  };

  useEffect(() => {
    console.log('Rendering Dashboard with columns:', columns);
  });

  return (
    <ErrorBoundary>
      <div className="p-6 bg-gray-100 min-h-[calc(100vh-64px)]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          {/* Add Job Button */}
          <div className="mb-6">
            <button
              onClick={addJob}
              className="px-4 py-2 bg-teal-500 text-white text-sm rounded hover:bg-teal-600"
            >
              Add Job
            </button>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="flex space-x-2">
              {columnIds.map((columnId) => (
                <div key={columnId} className="w-[19.2%] min-h-[300px] bg-gray-200 p-2 rounded">
                  <h2 className="text-md font-medium mb-2 capitalize flex justify-between items-center text-gray-700">
                    {columnId.charAt(0).toUpperCase() + columnId.slice(1)}
                    {columnId === 'applied' && (
                      <button
                        onClick={addJob}
                        className="px-2 py-1 bg-teal-500 text-white text-xs rounded hover:bg-teal-600"
                      >
                        +
                      </button>
                    )}
                  </h2>
                  <SortableContext items={columns[columnId].map((item) => item.id)}>
                    <div className="min-h-[250px] space-y-2">
                      {columns[columnId].length === 0 ? (
                        <p className="text-gray-500 text-center text-xs">No jobs</p>
                      ) : (
                        columns[columnId].map((item) => (
                          <SortableJob key={item.id} id={item.id} title={item.title} />
                        ))
                      )}
                    </div>
                  </SortableContext>
                </div>
              ))}
            </div>
          </DndContext>
        </div>
      </div>
    </ErrorBoundary>
  );
}
<template>
  <div
    class="note-card group bg-white rounded-2xl border border-gray-200/60 hover:border-indigo-300/60 hover:shadow-soft transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
    :class="{ completed: note.completed }"
  >
    <!-- Gradient overlay for completed notes -->
    <div
      v-if="note.completed"
      class="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 pointer-events-none"
    ></div>

    <!-- Priority indicator -->
    <div v-if="note.priority" class="absolute top-3 right-3">
      <div
        class="w-2 h-2 rounded-full animate-pulse"
        :class="{
          'bg-red-500': note.priority === 'high',
          'bg-yellow-500': note.priority === 'medium',
          'bg-green-500': note.priority === 'low',
        }"
      ></div>
    </div>

    <div class="p-6 relative z-10">
      <!-- Header -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1 min-w-0">
          <h3
            class="font-semibold text-gray-900 mb-2 line-clamp-2 transition-all duration-200"
            :class="{ 'line-through text-gray-500': note.completed }"
          >
            {{ note.title }}
          </h3>
          <p
            class="text-gray-600 text-sm line-clamp-3 leading-relaxed"
            :class="{ 'line-through text-gray-400': note.completed }"
          >
            {{ note.content }}
          </p>
        </div>
      </div>

      <!-- Tags and metadata -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex flex-wrap gap-2">
          <span
            v-if="note.category"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
          >
            <svg
              class="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              ></path>
            </svg>
            {{ note.category }}
          </span>
          <template v-if="note.tags && note.tags.length">
            <span
              v-for="tag in note.tags.slice(0, 2)"
              :key="tag"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
            >
              #{{ tag }}
            </span>
            <span
              v-if="note.tags.length > 2"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
            >
              +{{ note.tags.length - 2 }}
            </span>
          </template>
        </div>
      </div>

      <!-- Footer with actions -->
      <div
        class="flex items-center justify-between pt-4 border-t border-gray-100"
      >
        <div class="flex items-center space-x-4 text-xs text-gray-500">
          <span class="flex items-center">
            <svg
              class="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            {{ formatDate(note.createdAt) }}
          </span>
          <span
            v-if="note.updatedAt && note.updatedAt !== note.createdAt"
            class="flex items-center"
          >
            <svg
              class="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            Updated
          </span>
        </div>

        <!-- Action buttons -->
        <div
          class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <button
            @click="$emit('toggle-complete')"
            :class="[
              'p-2 rounded-lg transition-all duration-200',
              note.completed
                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                : 'bg-gray-100 text-gray-400 hover:text-green-600 hover:bg-green-50',
            ]"
            :title="note.completed ? 'Mark as incomplete' : 'Mark as complete'"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </button>

          <button
            @click="$emit('edit')"
            class="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-200"
            title="Edit note"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
          </button>

          <button
            @click="$emit('duplicate')"
            class="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-all duration-200"
            title="Duplicate note"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              ></path>
            </svg>
          </button>

          <button
            @click="$emit('delete')"
            class="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200"
            title="Delete note"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Completion checkmark overlay -->
    <div
      v-if="note.completed"
      class="absolute top-4 left-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
    >
      <svg
        class="w-4 h-4 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoteCard",
  props: {
    note: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "Today";
      if (diffDays === 2) return "Yesterday";
      if (diffDays <= 7) return `${diffDays - 1} days ago`;

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    },
  },
};
</script>

<style scoped>
.note-card {
  position: relative;
}

.note-card.completed {
  opacity: 0.8;
}

.note-card.completed:hover {
  opacity: 1;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Hover effects */
.note-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Animation for new notes */
.note-card {
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

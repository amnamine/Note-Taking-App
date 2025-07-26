<template>
  <div
    class="sidebar bg-white/90 backdrop-blur-md border-r border-gray-200/50 h-screen w-64 fixed left-0 top-0 z-40 transition-all duration-300"
    :class="{ '-translate-x-full': !isOpen }"
  >
    <!-- Sidebar Header -->
    <div class="p-6 border-b border-gray-200/50">
      <div class="flex items-center space-x-3">
        <div
          class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
        >
          <svg
            class="w-6 h-6 text-white"
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
        </div>
        <div>
          <h1
            class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            NoteFlow
          </h1>
          <p class="text-xs text-gray-500">Organize your thoughts</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="p-4 space-y-2">
      <div class="mb-6">
        <h3
          class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3"
        >
          Quick Actions
        </h3>
        <div class="space-y-1">
          <button
            @click="$emit('new-note')"
            class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 group"
          >
            <svg
              class="w-5 h-5 mr-3 text-gray-400 group-hover:text-indigo-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            New Note
          </button>

          <button
            @click="$emit('quick-capture')"
            class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 group"
          >
            <svg
              class="w-5 h-5 mr-3 text-gray-400 group-hover:text-purple-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              ></path>
            </svg>
            Quick Capture
          </button>
        </div>
      </div>

      <!-- Views -->
      <div class="mb-6">
        <h3
          class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3"
        >
          Views
        </h3>
        <div class="space-y-1">
          <button
            @click="$emit('view-change', 'all')"
            :class="[
              'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group',
              currentView === 'all'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-50',
            ]"
          >
            <svg
              class="w-5 h-5 mr-3"
              :class="
                currentView === 'all'
                  ? 'text-indigo-500'
                  : 'text-gray-400 group-hover:text-gray-500'
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            All Notes
            <span
              class="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full"
              >{{ totalNotes }}</span
            >
          </button>

          <button
            @click="$emit('view-change', 'recent')"
            :class="[
              'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group',
              currentView === 'recent'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-50',
            ]"
          >
            <svg
              class="w-5 h-5 mr-3"
              :class="
                currentView === 'recent'
                  ? 'text-indigo-500'
                  : 'text-gray-400 group-hover:text-gray-500'
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Recent
            <span
              class="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full"
              >{{ recentNotes }}</span
            >
          </button>

          <button
            @click="$emit('view-change', 'favorites')"
            :class="[
              'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group',
              currentView === 'favorites'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-50',
            ]"
          >
            <svg
              class="w-5 h-5 mr-3"
              :class="
                currentView === 'favorites'
                  ? 'text-indigo-500'
                  : 'text-gray-400 group-hover:text-gray-500'
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
            Favorites
            <span
              class="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full"
              >{{ favoriteNotes }}</span
            >
          </button>

          <button
            @click="$emit('view-change', 'completed')"
            :class="[
              'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group',
              currentView === 'completed'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-50',
            ]"
          >
            <svg
              class="w-5 h-5 mr-3"
              :class="
                currentView === 'completed'
                  ? 'text-indigo-500'
                  : 'text-gray-400 group-hover:text-gray-500'
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Completed
            <span
              class="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full"
              >{{ completedNotes }}</span
            >
          </button>
        </div>
      </div>

      <!-- Categories -->
      <div class="mb-6">
        <div class="flex items-center justify-between px-3 mb-3">
          <h3
            class="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Categories
          </h3>
          <button
            @click="$emit('add-category')"
            class="text-gray-400 hover:text-indigo-500 transition-colors"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
          </button>
        </div>
        <div class="space-y-1">
          <button
            v-for="category in categories"
            :key="category"
            @click="$emit('category-select', category)"
            :class="[
              'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group',
              selectedCategory === category
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-50',
            ]"
          >
            <div
              class="w-3 h-3 rounded-full mr-3"
              :class="getCategoryColor(category)"
            ></div>
            {{ category }}
            <span
              class="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full"
            >
              {{ getCategoryCount(category) }}
            </span>
          </button>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="tags.length > 0" class="mb-6">
        <h3
          class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3"
        >
          Popular Tags
        </h3>
        <div class="px-3 space-y-2">
          <div
            v-for="tag in tags.slice(0, 5)"
            :key="tag.name"
            class="flex items-center justify-between group cursor-pointer"
            @click="$emit('tag-select', tag.name)"
          >
            <span
              class="text-sm text-gray-600 group-hover:text-indigo-600 transition-colors"
            >
              #{{ tag.name }}
            </span>
            <span class="text-xs text-gray-400">{{ tag.count }}</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar Footer -->
    <div
      class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm"
    >
      <div class="flex items-center justify-between">
        <div class="text-xs text-gray-500">{{ totalNotes }} notes</div>
        <button
          @click="$emit('settings')"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Overlay -->
  <div
    v-if="isOpen"
    @click="$emit('close')"
    class="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
  ></div>
</template>

<script>
export default {
  name: "AppSidebar",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    currentView: {
      type: String,
      default: "all",
    },
    selectedCategory: {
      type: String,
      default: "",
    },
    notes: {
      type: Array,
      default: () => [],
    },
    categories: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    totalNotes() {
      return this.notes.length;
    },
    recentNotes() {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return this.notes.filter((note) => new Date(note.createdAt) > oneWeekAgo)
        .length;
    },
    favoriteNotes() {
      return this.notes.filter((note) => note.favorite).length;
    },
    completedNotes() {
      return this.notes.filter((note) => note.completed).length;
    },
    tags() {
      const tagCounts = {};
      this.notes.forEach((note) => {
        if (note.tags) {
          note.tags.forEach((tag) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });
      return Object.entries(tagCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    },
  },
  methods: {
    getCategoryColor(category) {
      const colors = {
        Personal: "bg-blue-500",
        Work: "bg-green-500",
        Ideas: "bg-purple-500",
        Tasks: "bg-orange-500",
        Important: "bg-red-500",
        Notes: "bg-gray-500",
      };
      return colors[category] || "bg-indigo-500";
    },
    getCategoryCount(category) {
      return this.notes.filter((note) => note.category === category).length;
    },
  },
};
</script>

<style scoped>
.sidebar {
  box-shadow: 4px 0 25px -5px rgba(0, 0, 0, 0.1);
}

@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
  }
}
</style>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
  >
    <!-- Sidebar -->
    <Sidebar
      :is-open="sidebarOpen"
      :current-view="currentView"
      :selected-category="selectedCategory"
      :notes="notes"
      :categories="categories"
      @close="sidebarOpen = false"
      @new-note="showNewNoteModal = true"
      @quick-capture="showQuickCapture = true"
      @view-change="currentView = $event"
      @category-select="selectedCategory = $event"
      @tag-select="selectedTag = $event"
      @add-category="showNewCategory = true"
      @settings="showSettings = true"
    />

    <!-- Main Content -->
    <div class="lg:ml-64 transition-all duration-300">
      <!-- Header -->
      <header
        class="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-30"
      >
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center space-x-4">
            <button
              @click="sidebarOpen = !sidebarOpen"
              class="lg:hidden p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            <div>
              <h1
                class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              >
                {{ getViewTitle() }}
              </h1>
              <p class="text-sm text-gray-500">{{ getViewDescription() }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Search -->
            <div class="relative hidden md:block">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search notes..."
                class="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
              <svg
                class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>

            <!-- View toggle -->
            <div class="flex bg-gray-100 rounded-lg p-1">
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'p-2 rounded-md transition-all duration-200',
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900',
                ]"
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
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  ></path>
                </svg>
              </button>
              <button
                @click="viewMode = 'list'"
                :class="[
                  'p-2 rounded-md transition-all duration-200',
                  viewMode === 'list'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900',
                ]"
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
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </div>

            <!-- Add note button -->
            <button
              @click="showNewNoteModal = true"
              class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span class="flex items-center">
                <svg
                  class="w-5 h-5 mr-2"
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
              </span>
            </button>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="p-6">
        <!-- Filters and Stats -->
        <div class="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div
            class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg"
          >
            <div class="flex items-center">
              <div class="p-3 bg-indigo-100 rounded-xl">
                <svg
                  class="w-6 h-6 text-indigo-600"
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
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Notes</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ filteredNotes.length }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg"
          >
            <div class="flex items-center">
              <div class="p-3 bg-green-100 rounded-xl">
                <svg
                  class="w-6 h-6 text-green-600"
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
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Completed</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ completedNotes }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg"
          >
            <div class="flex items-center">
              <div class="p-3 bg-purple-100 rounded-xl">
                <svg
                  class="w-6 h-6 text-purple-600"
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
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Favorites</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ favoriteNotes }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg"
          >
            <div class="flex items-center">
              <div class="p-3 bg-orange-100 rounded-xl">
                <svg
                  class="w-6 h-6 text-orange-600"
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
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">This Week</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ thisWeekNotes }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes Grid/List -->
        <div v-if="filteredNotes.length === 0" class="text-center py-16">
          <div
            class="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-16 h-16 text-indigo-400"
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
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">
            {{ getEmptyStateTitle() }}
          </h3>
          <p class="text-gray-500 mb-6">{{ getEmptyStateDescription() }}</p>
          <button
            @click="showNewNoteModal = true"
            class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Create Your First Note
          </button>
        </div>

        <div
          v-else
          :class="
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          "
        >
          <NoteCard
            v-for="(note, index) in filteredNotes"
            :key="note.id"
            :note="note"
            @toggle-complete="toggleComplete(index)"
            @edit="editNote(index)"
            @duplicate="duplicateNote(index)"
            @delete="deleteNote(index)"
          />
        </div>
      </main>
    </div>

    <!-- New Note Modal -->
    <div
      v-if="showNewNoteModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
    >
      <div
        class="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900">Create New Note</h3>
          <button
            @click="showNewNoteModal = false"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="addNote" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Title</label
            >
            <input
              v-model="newNote.title"
              type="text"
              placeholder="Enter note title..."
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Content</label
            >
            <textarea
              v-model="newNote.content"
              placeholder="Write your note here..."
              rows="6"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Category</label
              >
              <select
                v-model="newNote.category"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Category</option>
                <option
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Priority</label
              >
              <select
                v-model="newNote.priority"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">No Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Tags (comma separated)</label
            >
            <input
              v-model="newNote.tagsInput"
              type="text"
              placeholder="work, important, ideas..."
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div class="flex space-x-4">
            <button
              type="submit"
              class="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create Note
            </button>
            <button
              type="button"
              @click="showNewNoteModal = false"
              class="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Note Modal -->
    <div
      v-if="editingNote !== null"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
    >
      <div
        class="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900">Edit Note</h3>
          <button
            @click="cancelEdit"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveEdit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Title</label
            >
            <input
              v-model="editingNote.title"
              type="text"
              placeholder="Enter note title..."
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Content</label
            >
            <textarea
              v-model="editingNote.content"
              placeholder="Write your note here..."
              rows="6"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Category</label
              >
              <select
                v-model="editingNote.category"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Category</option>
                <option
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Priority</label
              >
              <select
                v-model="editingNote.priority"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">No Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div class="flex space-x-4">
            <button
              type="submit"
              class="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Save Changes
            </button>
            <button
              type="button"
              @click="cancelEdit"
              class="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- New Category Modal -->
    <div
      v-if="showNewCategory"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <h3 class="text-xl font-bold text-gray-900 mb-4">
          Create New Category
        </h3>
        <input
          v-model="newCategoryName"
          type="text"
          placeholder="Category name..."
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
        />
        <div class="flex space-x-3">
          <button
            @click="addCategory"
            class="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Add Category
          </button>
          <button
            @click="showNewCategory = false"
            class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoteCard from "./components/NoteCard.vue";
import Sidebar from "./components/Sidebar.vue";

export default {
  name: "App",
  components: {
    Sidebar,
    NoteCard,
  },
  data() {
    return {
      notes: JSON.parse(localStorage.getItem("notes")) || [],
      categories: JSON.parse(localStorage.getItem("categories")) || [
        "Personal",
        "Work",
        "Ideas",
        "Tasks",
        "Important",
      ],
      searchQuery: "",
      selectedCategory: "",
      selectedTag: "",
      currentView: "all",
      viewMode: "grid",
      sidebarOpen: false,
      showNewNoteModal: false,
      showNewCategory: false,
      showQuickCapture: false,
      showSettings: false,
      newNote: {
        title: "",
        content: "",
        category: "",
        priority: "",
        tagsInput: "",
      },
      newCategoryName: "",
      editingNote: null,
      editingIndex: null,
    };
  },
  computed: {
    filteredNotes() {
      let filtered = this.notes;

      // Apply view filter
      if (this.currentView === "recent") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = filtered.filter(
          (note) => new Date(note.createdAt) > oneWeekAgo
        );
      } else if (this.currentView === "favorites") {
        filtered = filtered.filter((note) => note.favorite);
      } else if (this.currentView === "completed") {
        filtered = filtered.filter((note) => note.completed);
      }

      // Apply search filter
      if (this.searchQuery) {
        filtered = filtered.filter(
          (note) =>
            note.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      // Apply category filter
      if (this.selectedCategory) {
        filtered = filtered.filter(
          (note) => note.category === this.selectedCategory
        );
      }

      // Apply tag filter
      if (this.selectedTag) {
        filtered = filtered.filter(
          (note) => note.tags && note.tags.includes(this.selectedTag)
        );
      }

      // Sort by date (newest first)
      return filtered.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },
    completedNotes() {
      return this.notes.filter((note) => note.completed).length;
    },
    favoriteNotes() {
      return this.notes.filter((note) => note.favorite).length;
    },
    thisWeekNotes() {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return this.notes.filter((note) => new Date(note.createdAt) > oneWeekAgo)
        .length;
    },
  },
  methods: {
    addNote() {
      if (this.newNote.title.trim()) {
        const note = {
          id: Date.now(),
          title: this.newNote.title.trim(),
          content: this.newNote.content.trim(),
          category: this.newNote.category,
          priority: this.newNote.priority,
          tags: this.newNote.tagsInput
            ? this.newNote.tagsInput
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag)
            : [],
          completed: false,
          favorite: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        this.notes.unshift(note);
        this.saveNotes();
        this.resetForm();
        this.showNewNoteModal = false;
      }
    },
    deleteNote(index) {
      this.notes.splice(index, 1);
      this.saveNotes();
    },
    editNote(index) {
      this.editingNote = { ...this.notes[index] };
      this.editingIndex = index;
    },
    saveEdit() {
      if (this.editingNote && this.editingIndex !== null) {
        this.editingNote.updatedAt = new Date().toISOString();
        this.notes[this.editingIndex] = { ...this.editingNote };
        this.saveNotes();
        this.cancelEdit();
      }
    },
    cancelEdit() {
      this.editingNote = null;
      this.editingIndex = null;
    },
    toggleComplete(index) {
      this.notes[index].completed = !this.notes[index].completed;
      this.notes[index].updatedAt = new Date().toISOString();
      this.saveNotes();
    },
    duplicateNote(index) {
      const originalNote = this.notes[index];
      const duplicatedNote = {
        ...originalNote,
        id: Date.now(),
        title: `${originalNote.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.notes.unshift(duplicatedNote);
      this.saveNotes();
    },
    addCategory() {
      if (
        this.newCategoryName.trim() &&
        !this.categories.includes(this.newCategoryName.trim())
      ) {
        this.categories.push(this.newCategoryName.trim());
        this.saveCategories();
        this.newCategoryName = "";
        this.showNewCategory = false;
      }
    },
    resetForm() {
      this.newNote = {
        title: "",
        content: "",
        category: "",
        priority: "",
        tagsInput: "",
      };
    },
    getViewTitle() {
      const titles = {
        all: "All Notes",
        recent: "Recent Notes",
        favorites: "Favorite Notes",
        completed: "Completed Notes",
      };
      return titles[this.currentView] || "All Notes";
    },
    getViewDescription() {
      const descriptions = {
        all: "All your notes in one place",
        recent: "Notes from the last 7 days",
        favorites: "Your favorite notes",
        completed: "Completed tasks and notes",
      };
      return descriptions[this.currentView] || "All your notes in one place";
    },
    getEmptyStateTitle() {
      const titles = {
        all: "No notes yet",
        recent: "No recent notes",
        favorites: "No favorite notes",
        completed: "No completed notes",
      };
      return titles[this.currentView] || "No notes yet";
    },
    getEmptyStateDescription() {
      const descriptions = {
        all: "Create your first note to get started!",
        recent: "No notes have been created in the last 7 days",
        favorites: "Mark some notes as favorites to see them here",
        completed: "Complete some notes to see them here",
      };
      return (
        descriptions[this.currentView] ||
        "Create your first note to get started!"
      );
    },
    saveNotes() {
      localStorage.setItem("notes", JSON.stringify(this.notes));
    },
    saveCategories() {
      localStorage.setItem("categories", JSON.stringify(this.categories));
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

body {
  font-family: "Inter", sans-serif;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

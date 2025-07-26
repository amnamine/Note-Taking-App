<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 4s;"></div>
    </div>

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
    <div class="transition-all duration-300 min-h-screen relative z-10">
      <!-- Header -->
      <header class="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-30 shadow-lg shadow-indigo-500/5">
        <div class="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div class="flex items-center space-x-4">
            <button @click="sidebarOpen = !sidebarOpen" 
                    class="p-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/80 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <div class="animate-fade-in">
              <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                {{ getViewTitle() }}
              </h1>
              <p class="text-sm text-gray-600 font-medium">{{ getViewDescription() }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Search -->
            <div class="relative hidden md:block group">
              <input v-model="searchQuery" type="text" placeholder="Search notes..."
                class="w-72 pl-12 pr-4 py-3 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl group-hover:bg-white/70" />
              <svg class="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            
            <!-- View toggle -->
            <div class="flex bg-white/50 backdrop-blur-sm rounded-2xl p-1 shadow-lg">
              <button @click="viewMode = 'grid'" 
                      :class="['p-3 rounded-xl transition-all duration-300', viewMode === 'grid' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105' : 'text-gray-600 hover:text-indigo-600 hover:bg-white/50']">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
              </button>
              <button @click="viewMode = 'list'" 
                      :class="['p-3 rounded-xl transition-all duration-300', viewMode === 'list' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105' : 'text-gray-600 hover:text-indigo-600 hover:bg-white/50']">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
              </button>
            </div>
            
            <!-- Add note button -->
            <button @click="showNewNoteModal = true" 
                    class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/25 animate-bounce-in">
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                New Note
              </span>
            </button>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="p-8 max-w-7xl mx-auto">
        <!-- Filters and Stats -->
        <div class="mb-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div class="flex items-center">
              <div class="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Notes</p>
                <p class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{{ filteredNotes.length }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div class="flex items-center">
              <div class="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Completed</p>
                <p class="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{{ completedNotes }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div class="flex items-center">
              <div class="p-4 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Favorites</p>
                <p class="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">{{ favoriteNotes }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div class="flex items-center">
              <div class="p-4 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">This Week</p>
                <p class="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">{{ thisWeekNotes }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes Grid/List -->
        <div v-if="filteredNotes.length === 0" class="text-center py-20 animate-fade-in">
          <div class="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-2xl animate-pulse-slow">
            <svg class="w-20 h-20 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-gradient">{{ getEmptyStateTitle() }}</h3>
          <p class="text-gray-600 text-lg mb-8 font-medium">{{ getEmptyStateDescription() }}</p>
          <button @click="showNewNoteModal = true" 
                  class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:shadow-indigo-500/25 animate-bounce-in">
            <span class="flex items-center text-lg">
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create Your First Note
            </span>
          </button>
        </div>

        <div v-else :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'">
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
    <div v-if="showNewNoteModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl mx-4 shadow-3xl max-h-[90vh] overflow-y-auto border border-white/30">
        <div class="flex items-center justify-between mb-8">
          <h3 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Create New Note</h3>
          <button @click="showNewNoteModal = false" 
                  class="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-110">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="addNote" class="space-y-8">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">Title</label>
            <input v-model="newNote.title" type="text" placeholder="Enter note title..."
              class="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl"
              required />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">Content</label>
            <textarea v-model="newNote.content" placeholder="Write your note here..."
              rows="6"
              class="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl resize-none"></textarea>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Category</label>
              <select v-model="newNote.category" 
                      class="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl">
                <option value="">Select Category</option>
                <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Priority</label>
              <select v-model="newNote.priority" 
                      class="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl">
                <option value="">No Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">Tags (comma separated)</label>
            <input v-model="newNote.tagsInput" type="text" placeholder="work, important, ideas..."
              class="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl" />
          </div>
          
          <div class="flex space-x-4 pt-4">
            <button type="submit" 
                    class="flex-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-4 px-8 rounded-2xl font-semibold hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/25 transform hover:scale-105">
              Create Note
            </button>
            <button type="button" @click="showNewNoteModal = false" 
                    class="flex-1 bg-gray-100 text-gray-700 py-4 px-8 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Note Modal -->
    <div v-if="editingNote !== null" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl mx-4 shadow-3xl max-h-[90vh] overflow-y-auto border border-white/30">
        <div class="flex items-center justify-between mb-8">
          <h3 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Edit Note</h3>
          <button @click="cancelEdit" 
                  class="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-110">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="saveEdit" class="space-y-8">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">Title</label>
            <input v-model="editingNote.title" type="text" placeholder="Enter note title..."
              class="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl"
              required />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">Content</label>
            <textarea v-model="editingNote.content" placeholder="Write your note here..."
              rows="6"
              class="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl resize-none"></textarea>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Category</label>
              <select v-model="editingNote.category" 
                      class="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl">
                <option value="">Select Category</option>
                <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Priority</label>
              <select v-model="editingNote.priority" 
                      class="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl">
                <option value="">No Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div class="flex space-x-4 pt-4">
            <button type="submit" 
                    class="flex-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-4 px-8 rounded-2xl font-semibold hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/25 transform hover:scale-105">
              Save Changes
            </button>
            <button type="button" @click="cancelEdit" 
                    class="flex-1 bg-gray-100 text-gray-700 py-4 px-8 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- New Category Modal -->
    <div v-if="showNewCategory" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md mx-4 shadow-3xl border border-white/30">
        <h3 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Create New Category</h3>
        <input v-model="newCategoryName" type="text" placeholder="Category name..."
          class="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl mb-6" />
        <div class="flex space-x-4">
          <button @click="addCategory" 
                  class="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            Add Category
          </button>
          <button @click="showNewCategory = false" 
                  class="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl">
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-bounce-in {
  animation: bounceIn 0.8s ease-out;
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Enhanced shadows */
.shadow-3xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
}

/* Glassmorphism effects */
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

/* Hover effects for interactive elements */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:bg-white\/70 {
  background-color: rgba(255, 255, 255, 0.7);
}

/* Enhanced focus states */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Pulse animation for background elements */
.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

/* Enhanced button hover effects */
button:hover {
  transform: translateY(-2px);
}

/* Gradient text animation */
.bg-clip-text {
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Enhanced modal animations */
.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Floating animation for cards */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Glow effects */
.glow {
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
}

.glow:hover {
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.5);
}

/* Enhanced border radius */
.rounded-3xl {
  border-radius: 1.5rem;
}

/* Custom focus ring */
.focus\:ring-indigo-500\/50:focus {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5);
}

/* Enhanced shadows with colors */
.shadow-indigo-500\/25 {
  box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.25);
}

.shadow-purple-500\/25 {
  box-shadow: 0 10px 25px -5px rgba(147, 51, 234, 0.25);
}

/* Smooth scaling for interactive elements */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:scale-110:hover {
  transform: scale(1.1);
}

/* Enhanced backdrop blur */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.backdrop-blur-md {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* Gradient backgrounds */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Enhanced transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Enhanced hover states */
.hover\:-translate-y-2:hover {
  transform: translateY(-8px);
}

/* Glass effect for cards */
.glass {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Enhanced shadows */
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Enhanced border colors */
.border-white\/20 {
  border-color: rgba(255, 255, 255, 0.2);
}

.border-white\/30 {
  border-color: rgba(255, 255, 255, 0.3);
}

/* Enhanced background colors */
.bg-white\/50 {
  background-color: rgba(255, 255, 255, 0.5);
}

.bg-white\/60 {
  background-color: rgba(255, 255, 255, 0.6);
}

.bg-white\/70 {
  background-color: rgba(255, 255, 255, 0.7);
}

.bg-white\/95 {
  background-color: rgba(255, 255, 255, 0.95);
}

/* Enhanced text colors */
.text-gray-600 {
  color: #4b5563;
}

.text-gray-700 {
  color: #374151;
}

/* Enhanced button styles */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
}

/* Enhanced input styles */
.input-enhanced {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.input-enhanced:focus {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Enhanced card styles */
.card-enhanced {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.card-enhanced:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Enhanced modal styles */
.modal-enhanced {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

/* Enhanced header styles */
.header-enhanced {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* Enhanced sidebar styles */
.sidebar-enhanced {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(25px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 4px 0 25px rgba(0, 0, 0, 0.1);
}

/* Enhanced button group styles */
.btn-group-enhanced {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 0.25rem;
}

/* Enhanced search styles */
.search-enhanced {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.search-enhanced:focus {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Enhanced empty state styles */
.empty-state-enhanced {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Enhanced icon styles */
.icon-enhanced {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
}

.icon-enhanced:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.4);
}

/* Enhanced text styles */
.text-enhanced {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease infinite;
}

/* Enhanced loading states */
.loading-enhanced {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Enhanced responsive design */
@media (max-width: 768px) {
  .mobile-enhanced {
    padding: 1rem;
    margin: 0.5rem;
  }
  
  .mobile-card {
    border-radius: 1rem;
    margin-bottom: 1rem;
  }
}

/* Enhanced accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Enhanced dark mode support */
@media (prefers-color-scheme: dark) {
  .dark-enhanced {
    background: rgba(17, 24, 39, 0.8);
    color: rgba(255, 255, 255, 0.9);
  }
  
  .dark-card {
    background: rgba(31, 41, 55, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
  }
}

/* Enhanced print styles */
@media print {
  .print-hidden {
    display: none !important;
  }
  
  .print-visible {
    display: block !important;
  }
}
</style>

<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-200 to-purple-200 flex items-center justify-center p-5">
    <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md transition-transform transform hover:scale-105">
      <h1 class="text-3xl font-semibold text-center mb-6 text-gray-800">Note Taking App</h1>
      <form @submit.prevent="addNote">
        <input v-model="newNote" type="text" placeholder="What do you want to remember?"
          class="border border-gray-300 p-4 w-full rounded-lg mb-4 shadow focus:outline-none focus:ring focus:ring-blue-300 transition"
          required />
        <button type="submit" class="bg-primary text-white p-2 rounded-lg w-full hover:bg-blue-600 transition">
          Add Note
        </button>
      </form>
      <div class="mt-4">
        <h2 class="text-xl font-semibold text-gray-800">Your Notes</h2>
        <ul class="mt-2">
          <li v-for="(note, index) in notes" :key="index"
            class="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-2 transition hover:shadow-md">
            <span class="text-gray-700">{{ note }}</span>
            <div>
              <button @click="editNote(index)"
                class="bg-yellow-500 text-white p-1 rounded-lg mr-1 hover:bg-yellow-400 transition">
                Edit
              </button>
              <button @click="deleteNote(index)"
                class="bg-danger text-white p-1 rounded-lg hover:bg-red-600 transition">
                Delete
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newNote: '',
      notes: JSON.parse(localStorage.getItem('notes')) || [],
    };
  },
  methods: {
    addNote() {
      if (this.newNote.trim()) {
        this.notes.push(this.newNote.trim());
        this.saveNotes();
        this.newNote = '';
      }
    },
    deleteNote(index) {
      this.notes.splice(index, 1);
      this.saveNotes();
    },
    editNote(index) {
      const updatedNote = prompt('Edit your note:', this.notes[index]);
      if (updatedNote !== null) {
        this.notes[index] = updatedNote;
        this.saveNotes();
      }
    },
    saveNotes() {
      localStorage.setItem('notes', JSON.stringify(this.notes));
    },
  },
};
</script>

<style scoped>
body {
  font-family: 'Poppins', sans-serif;
}
</style>

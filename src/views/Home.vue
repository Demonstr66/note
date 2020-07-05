<template>
  <div class="main">
    <header class="header">
      <h1>Notes</h1>
      <div class="btn-group">
        <btn @click.native="showModalAdd" light>
          <icon i="plus" size="15px" />
          <pre>  add</pre>
        </btn>
      </div>
    </header>
    <main>
      <transition-group
        name="gallery"
        tag="div"
        class="grid"
        v-if="notes.length"
      >
        <card
          class="cell"
          v-for="note in notes"
          @delete="showModalDelete(note.id)"
          @edit="editNote(note.id)"
          :key="note.id"
          :note="note"
          :todos="getTodos(note.id)"
        />
        <div class="grid-clearfix cell" v-for="n in 5" :key="n - 10"></div>
      </transition-group>
      <div class="empty" v-else>
        <p>
          No notes yet. Click
          <a @click="showModalAdd">here</a>
          to create the first one!
        </p>
      </div>
    </main>
    <!-- Modals -->
    <modal
      :open="showAddNote"
      @success="createNote"
      @close="closeModalAdd"
      @cancel="closeModalAdd"
      title=""
    >
      <input
        type="text"
        class="text"
        id="text"
        placeholder="Enter note title"
        v-model="newNoteTitle"
      />
      <label v-show="addError">Title is required</label>
    </modal>
    <modal
      :open="showDeleteNote"
      @success="deleteNote"
      @close="closeModalDelete"
      @cancel="closeModalDelete"
      title="Deleting note"
    >
      Are you sure, that want to delete
      <b>
        {{ deletingNote ? deletingNote.title : "" }}
      </b>
      ?
    </modal>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "About",
  data() {
    return {
      showAddNote: false,
      addError: false,
      showDeleteNote: false,
      deletingNote: undefined,
      newNoteTitle: ""
    };
  },
  computed: {
    ...mapState(["notes", "todos"])
  },
  methods: {
    getTodos(noteId) {
      return this.todos.filter(t => t.noteId == noteId) || [];
    },
    showModalAdd() {
      this.showAddNote = true;
      setTimeout(() => {
        document.querySelector("#text").focus();
      }, 0);
    },
    closeModalAdd() {
      this.showAddNote = false;
      this.newNoteTitle = "";
      this.addError = false;
    },
    createNote() {
      if (!this.newNoteTitle) {
        this.addError = true;
        return;
      }

      const id = this.$store.dispatch("addNote", this.newNoteTitle);

      this.closeModalAdd();

      this.$router.push({ name: "Note", params: { id } });
    },
    showModalDelete(id) {
      this.deletingNote = this.notes.find(n => n.id == id);
      if (id) this.showDeleteNote = true;
    },
    closeModalDelete() {
      this.showDeleteNote = false;
    },
    deleteNote() {
      this.$store.dispatch("removeNote", this.deletingNote.id);
      this.closeModalDelete();
    },
    editNote(id) {
      this.$router.push({ name: "Note", params: { id } });
    }
  }
};
</script>

<style lang="scss" scoped>
$light: #fbf1d6;

.grid {
  display: flex;
  flex-flow: row wrap;
  align-items: stretch;
  justify-content: flex-start;
  margin: 10px 10px;

  & > .cell {
    flex-grow: 1;
    flex-basis: 210px;
    padding: 5px;
    margin: 3px;
    box-sizing: border-box;
    overflow: hidden;
  }
  & .grid-clearfix {
    opacity: 0;
    height: 0px;
    padding: 0;
    overflow: hidden;
  }
}
.gallery-enter-active,
.gallery-leave-active {
  transition: all 0.5s;
}
.gallery-enter,
.gallery-leave-to {
  opacity: 0;
  transform: translatex(-100px);
}
</style>

<template>
  <div class="main">
    <header class="header">
      <h1 @click="leave">Notes</h1>
      <div class="btn-group">
        <btn light :disabled="state.length < 2" @click="undoHandler">
          <icon i="undo" size="15px" />
        </btn>
        <btn light :disabled="!redo.length" @click="redoHandler">
          <icon i="redo" size="15px" />
        </btn>
        <btn light :disabled="isSave" @click="saveHandler">
          <transition name="saved" mode="out-in">
            <icon
              i="done"
              size="15px"
              color="#3a3"
              v-if="saveBtn"
              key="done"
              class="icon-save"
            />
            <icon i="save" size="15px" v-else key="save" />
          </transition>
        </btn>
        <btn light @click="showDelModal"><icon i="recycle" size="15px"/></btn>
      </div>
    </header>
    <main>
      <form @submit.prevent="">
        <input
          type="text"
          placeholder="Title"
          class="text bg-none"
          v-model="current.title"
        />
        <label v-show="!current.title">Field required</label>
        <div class="todos" v-if="current.todos.length">
          <div class="todo" v-for="todo in current.todos" :key="todo.id">
            <input type="checkbox" v-model="todo.done" />
            <span :class="{ done: todo.done }">{{ todo.text }}</span>
            <div class="btn-group">
              <btn @click.native="showAddModal(todo)">
                <icon i="pencil" size="15px" />
              </btn>
              <btn @click.native="removeTodo(todo.id)">
                <icon i="recycle" size="15px" />
              </btn>
            </div>
          </div>
        </div>
        <div class="main-empty" v-else>
          Todo not yet added
        </div>
        <btn light fluid @click.native="showAddModal">
          <icon i="plus" size="15px" />
          <b>Add new todo</b>
        </btn>
      </form>
    </main>
    <!-- Modals -->
    <modal
      title="Deleting note"
      :open="delNoteModal.open"
      @close="closeDelModal"
      @cancel="closeDelModal"
      @success="removeThis"
    >
      Are you sure, that want to delete this note?
    </modal>
    <modal
      :open="addModal.open"
      @close="closeAddModal"
      @cancel="closeAddModal"
      @success="okAddModal"
    >
      <input
        id="text"
        type="text"
        class="text"
        placeholder="Todo text"
        v-model="addModal.text"
      />
      <label v-show="addModal.error">Text is required</label>
    </modal>
    <modal
      title="Note not saved"
      :open="leaveModal.open"
      @close="closeLeaveModal"
      @cancel="closeLeaveModal"
      @success="goHome"
    >
      The note was <b>not saved</b>. Want to continue?
    </modal>
  </div>
</template>

<script>
import { v4 } from "uuid";

export default {
  name: "Note",
  data() {
    return {
      noteId: "",
      saveBtn: false,
      current: {
        title: "",
        todos: []
      },
      base: "",
      state: [],
      redo: [],
      addModal: {
        todoId: "",
        open: false,
        text: "",
        error: false
      },
      delNoteModal: {
        open: false
      },
      leaveModal: {
        open: false
      }
    };
  },
  async created() {
    this.noteId = await this.$route.params.id;
    if (!this.noteId) {
      this.goHome();
      return;
    }

    this.initial(this.noteId);
  },
  mounted() {
    this.$watch(
      "current",
      function() {
        this.snapshot();
      },
      { deep: true }
    );
  },
  computed: {
    //return true if current version saved
    isSave() {
      if (!this.state.length) return true;
      const base = JSON.parse(this.base);

      if (this.current.title != base.title) return false;
      if (this.compare(this.current.todos, base.todos).length) return false;

      return true;
    }
  },
  methods: {
    initial(id) {
      const note = this.$store.getters.getNoteById(id);
      const todos = JSON.stringify(this.$store.getters.getTodosById(id));

      if (!note) {
        this.goHome();
        return;
      }

      this.current = { ...note, todos: JSON.parse(todos) || [] };

      this.base = JSON.stringify(this.current);
    },
    goHome() {
      this.$router.push({ name: "Home" });
    },
    showAddModal(todo) {
      if (todo) {
        this.addModal.text = todo.text;
        this.addModal.todoId = todo.id;
      }

      this.addModal.open = true;
      setTimeout(() => {
        document.querySelector("#text").focus();
      }, 0);
    },
    closeAddModal() {
      this.addModal.open = false;
      this.addModal.text = "";
      this.addModal.todoId = "";
      this.addModal.error = false;
    },
    okAddModal() {
      if (!this.addModal.text) {
        this.addModal.error = true;
        return;
      }

      if (this.addModal.todoId) {
        this.current.todos = this.current.todos.map(t => {
          if (t.id == this.addModal.todoId) {
            t.text = this.addModal.text;
          }

          return t;
        });

        this.closeAddModal();

        return;
      }
      const todo = {
        noteId: this.noteId,
        id: v4(),
        done: false,
        text: this.addModal.text
      };

      this.current.todos.push(todo);

      this.closeAddModal();
    },
    showDelModal() {
      this.delNoteModal.open = true;
    },
    closeDelModal() {
      this.delNoteModal.open = false;
    },
    showLeaveModal() {
      this.leaveModal.open = true;
    },
    closeLeaveModal() {
      this.leaveModal.open = false;
    },
    leave() {
      if (this.isSave) {
        this.goHome();
      } else {
        this.showLeaveModal();
      }
    },
    snapshot() {
      //create copy to history state
      if (this.state.length > 49) {
        this.state = this.state.slice(1);
      }

      this.state.push(JSON.stringify(this.current));
    },
    saveHandler() {
      this.$store.dispatch("updateNote", { id: this.noteId, ...this.current });
      this.base = JSON.stringify({ id: this.noteId, ...this.current });
      this.saveBtn = true;

      //save button animation
      setTimeout(() => {
        this.saveBtn = false;
      }, 800);
    },
    removeTodo(id) {
      this.current.todos = this.current.todos.filter(t => t.id != id);
    },
    undoHandler() {
      if (this.state.length > 1) {
        this.redo.push(this.state.pop());

        this.current = JSON.parse(this.state.pop());
      }
    },
    redoHandler() {
      if (this.redo.length) {
        this.current = JSON.parse(this.redo.pop());
      }
    },
    removeThis() {
      this.goHome();

      this.$store.dispatch("removeNote", this.noteId);
    },
    compare(a1, a2) {
      //compare arrays
      return a1
        .filter(
          i =>
            !this.compareTodo(
              i,
              a2.find(t => t.id == i.id)
            )
        )
        .concat(
          a2.filter(
            i =>
              !this.compareTodo(
                i,
                a1.find(t => t.id == i.id)
              )
          )
        );
    },
    compareTodo(t1, t2) {
      //compare todo
      if (!t1 || !t2) return false;
      if (t1.text != t2.text) return false;
      if (t1.done != t2.done) return false;

      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/main.scss";

form {
  width: 90vw;
  margin: 20px auto;
  padding: 5px;
  box-sizing: border-box;
  background-color: $form-bg;
  border-radius: 3px;
  border: 2px solid $header-bg;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);

  @include for-tablet-landscape-up {
    width: 50vw;
  }
}
.todos {
  border-bottom: 2px solid #444;
  margin-bottom: 10px;
}
.todo {
  display: flex;
  flex-flow: row nowrap;
  flex-grow: 1;
  align-items: center;
  justify-content: flex-start;
  padding: 5px;
  border-bottom: 1px solid gray;

  & > span {
    text-align: left;
    word-break: break-all;
  }

  &:last-child {
    border-bottom: 0;
  }
  & :last-child {
    margin-left: auto;
  }

  input {
    cursor: pointer;
    height: 16px;
    min-width: 16px;
    margin: 0 5px;
  }
  .done {
    color: gray;
    text-decoration: line-through;
  }
}
button > b {
  margin-left: 7px;
}
.icon-save {
  transform: scale(1.2);
}
.saved-enter-active,
.saved-leave-active {
  transition: transform 0.3s, opacity 0.3s;
}
.saved-enter,
.saved-leave-to {
  opacity: 0;
  transform: scale(1.5) !important;
}
</style>

<template>
  <section class="card">
    <div class="card__header">
      <div class="card__title" :title="note.title">{{ note.title }}</div>
      <div class="btn-group">
        <btn @click.native="editHandler">
          <icon i="pencil" size="15px" />
        </btn>
        <btn @click.native="deleteHandler" color="red">
          <icon i="recycle" size="15px" />
        </btn>
      </div>
    </div>
    <div class="card__content">
      <ul class="card__list">
        <li
          class="card__todo"
          v-for="(todo, idx) in todos.slice(0, 3)"
          :key="idx"
        >
          <icon
            class="todo__check"
            :i="todo.done ? 'done' : 'x'"
            :color="todo.done ? '#3a3' : '#f33'"
            size="15px"
          />
          <p :title="todo.text">
            {{ todo.text }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: "Card",
  props: {
    note: {
      type: Object,
      required: true
    },
    todos: {
      type: Array,
      required: true
    }
  },
  methods: {
    editHandler() {
      this.$emit("edit");
    },
    deleteHandler() {
      this.$emit("delete");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/main.scss";

.card {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 4px;
  border-radius: 3px;
  border: 2px solid $header-bg;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  background-color: $form-bg;
}
.card__header {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  text-align: center;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 3px;
  border-bottom: 2px solid $inner-border;
  overflow: hidden;
  .btn-group {
    position: absolute;
    top: 0;
    right: 0;
  }
}
.card__title {
  line-height: 24px;
  font-size: 24px;
  font-weight: 800;
  margin-left: 10px;
  margin-right: 50px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-clamp: 1;
}
.card__content {
  padding: 10px 10%;
}
.card__todo {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  flex-basis: 15px;
  align-items: flex-end;
  justify-content: flex-start;
  border-bottom: 1px solid black;
  margin-top: 9px;
  padding-bottom: 4px;

  & p {
    display: -moz-box;
    -moz-box-orient: vertical;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    line-clamp: 1;
    text-align: left;
    overflow-wrap: break-word;
  }

  .todo__check {
    min-width: 15px;
    margin-right: 10px;
  }
}
</style>

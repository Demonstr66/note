import Vue from "vue";
import Vuex from "vuex";
import { v4 } from "uuid";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    notes: [],
    todos: []
  },
  mutations: {
    setState(s, payload) {
      s.notes = payload.notes
      s.todos = payload.todos
    },
    addNote(s, payload) {
      s.notes.push(payload)
    },
    addTodos(s, payload) {
      s.todos = s.todos.concat(payload)
    },
    removeNote(s, id) {
      s.notes = s.notes.filter(n => n.id != id)
      s.todos = s.todos.filter(t => t.noteId != id)
    }
  },
  getters: {
    getNoteById: s => id => s.notes.find(n => n.id == id),
    getTodosById: s => noteId => s.todos.filter(t => t.noteId == noteId)

  },
  actions: {
    getDataFromBase({commit}) {
      const data = JSON.parse(localStorage.getItem('data')) || []

      if (!data) return

      const notes = data.notes|| []
      const todos = data.todos || []

      commit('setState', {notes, todos})
    },
    saveData({state}) {
      localStorage.removeItem('data')
      localStorage.setItem('data', JSON.stringify({notes: state.notes, todos: state.todos}))
    },
    addNote({commit, dispatch}, title) {
      const note = {id: v4(), title}
      
      commit("addNote", note)

      dispatch("saveData")

      return note.id
    },
    removeNote({commit,dispatch}, id) {
      commit("removeNote", id)

      dispatch("saveData")
    },
    updateNote({commit,dispatch}, data) {
      commit("removeNote", data.id)
      commit("addNote", {id: data.id, title: data.title})
      commit("addTodos", data.todos)

      dispatch("saveData")
    }

  },
  modules: {}
});

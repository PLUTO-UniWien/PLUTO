import streamlit as st
from enum import Enum


class AppState:
    @staticmethod
    def get(state: Enum):
        state_name = state.name
        return st.session_state.get(state_name, state.value)

    @staticmethod
    def set(state: Enum, value):
        state_name = state.name
        st.session_state[state_name] = value

    @staticmethod
    def reset(state: Enum):
        state_name = state.name
        st.session_state[state_name] = state.value

    @staticmethod
    def reset_all():
        st.session_state.clear()

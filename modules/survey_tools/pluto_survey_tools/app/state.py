from enum import Enum

import streamlit as st
from loguru import logger


class AppState:
    @staticmethod
    def get(state: Enum):
        state_name = state.name
        return st.session_state.get(state_name, state.value)

    @staticmethod
    def set(state: Enum, value):
        state_name = state.name
        if state_name in st.session_state:
            del st.session_state[state_name]
        st.session_state[state_name] = value
        logger.debug(f"Set state `{state_name}` to `{value}`.")

    @staticmethod
    def reset(state: Enum):
        AppState.set(state, state.value)
        logger.debug(f"Reset state `{state.name}` to `{state.value}`.")

    @staticmethod
    def reset_all():
        st.session_state.clear()

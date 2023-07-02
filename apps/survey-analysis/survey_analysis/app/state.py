from enum import Enum
from typing import Any

import streamlit as st
from loguru import logger


def _state_value(state: Enum) -> Any:
    """
    Each state is a tuple of (index, value).
    This way, we can use the index as value IDs
    and the value as the default value.
    """
    assert isinstance(state.value, tuple) and len(state.value) == 2
    tpl: tuple[int, Any] = state.value
    return tpl[1]


def _state_key(state: Enum) -> str:
    """
    The state key is the state's class name and the state's name.
    """
    return ".".join([state.__class__.__name__, state.name])


class AppState:
    @staticmethod
    def get(state: Enum):
        state_key = _state_key(state)
        state_value = _state_value(state)
        return st.session_state.get(state_key, state_value)

    @staticmethod
    def set(state: Enum, value):
        state_key = _state_key(state)
        if state_key in st.session_state:
            del st.session_state[state_key]
        st.session_state[state_key] = value
        logger.debug(f"Set state `{state_key}` to `{value}`.")

    @staticmethod
    def reset(state: Enum):
        state_value = _state_value(state)
        AppState.set(state, state_value)
        logger.debug(f"Reset state `{state.name}` to `{state_value}`.")

    @staticmethod
    def reset_all():
        st.session_state.clear()

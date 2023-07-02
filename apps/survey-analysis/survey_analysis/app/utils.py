import streamlit as st


def make_grid(cols: int, rows: int):
    grid = [0] * rows
    for i in range(rows):
        with st.container():
            grid[i] = st.columns(cols)
    return grid

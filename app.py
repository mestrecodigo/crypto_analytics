import streamlit as st

# Lê o conteúdo do index.html
with open("index.html", "r", encoding="utf-8") as f:
    html_content = f.read()

# Título da página
st.set_page_config(page_title="Meu App HTML", layout="wide")
st.title("🚀 Visualização do index.html")

# Renderiza o HTML no app usando componente de iframe
st.components.v1.html(html_content, height=800, scrolling=True)

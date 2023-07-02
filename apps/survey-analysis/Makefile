.PHONY: serve
serve:
	@echo "🚀 Running Streamlit App"
	LOCAL=True poetry run streamlit run survey_analysis/app/home.py --server.headless True


.PHONY: lint
lint:
	@echo "==> 👕 Linting"
	@poetry run black .
	@poetry run ruff .

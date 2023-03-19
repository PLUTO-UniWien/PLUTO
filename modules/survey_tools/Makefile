.PHONY: run
run:
	@echo "🚀 Running Streamlit App"
	LOCAL=True streamlit run pluto_survey_tools/app/home.py --server.headless True


.PHONY: lint
lint:
	@echo "==> 👕 Linting"
	@poetry run black .
	@poetry run ruff .

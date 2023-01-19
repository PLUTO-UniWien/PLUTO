import json
from pathlib import Path
from pluto_survey_tools.model import Questionnaire

questionnaire_path = Path(__file__).parent.parent.parent.parent / "assets" / "questionnaire.json"
questionnaire_dict = json.loads(questionnaire_path.read_text())
QUESTIONNAIRE = Questionnaire.from_dict(questionnaire_dict)

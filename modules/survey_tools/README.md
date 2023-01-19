# PLUTO Survey Tools

## Loading the Questionnaire

Assuming that your `pwd` is `modules/survey_tools`, you can load the questionnaire data with:

```python
import json
from pathlib import Path
from pluto_survey_tools.model import Questionnaire

questionnaire_path = Path('../../assets/questionnaire.json')
questionnaire_dict = json.loads(questionnaire_path.read_text())
questionnaire = Questionnaire.from_dict(questionnaire_dict)
```
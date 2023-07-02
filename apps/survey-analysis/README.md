# PLUTO Survey Tools

## Loading the Questionnaire

Assuming that your `pwd` is `modules/survey_tools`, you can load the questionnaire data with:

```python
import json
from pathlib import Path
from survey_analysis.model import Questionnaire

questionnaire_path = Path('../../assets/questionnaire.json')
questionnaire_dict = json.loads(questionnaire_path.read_text())
questionnaire = Questionnaire.from_dict(questionnaire_dict)
```

Alternatively, you can just call:

```python
from survey_analysis import QUESTIONNAIRE
```

## Getting min-max ranges

```python
from survey_analysis import QUESTIONNAIRE
import survey_analysis.stats as stats

print(f'# Questionnaire: {stats.score_range_questionnaire(QUESTIONNAIRE)}', end='\n\n')

for section in QUESTIONNAIRE.sections:
    print(f'## {section.title}: {stats.score_range_section(section)}', end='\n\n')
    for i, question in enumerate(section.questions):
        print(f'### Q{i + 1}: {stats.score_range_question(question)}')
    print()
```

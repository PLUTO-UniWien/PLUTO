_vega_lite_scheme_tuples = [
    ("blues", "#125ca4"),
    ("greens", "#107734"),
    ("oranges", "#b93d02"),
    ("reds", "#b21117"),
    ("purples", "#5c3696"),
    ("viridis", "#bcdf27"),
    ("magma", "#fece91"),
    ("inferno", "#f6d646"),
    ("plasma", "#fcce25"),
    ("bluegreen", "#107736"),
    ("bluepurple", "#822287"),
    ("greenblue", "#1675b1"),
    ("orangered", "#bf120d"),
    ("purplebluegreen", "#02736b"),
    ("purpleblue", "#056199"),
    ("purplered", "#ab0549"),
    ("redpurple", "#ab0549"),
]
VEGA_LITE_COLOR_SCHEMES = [scheme for scheme, _ in _vega_lite_scheme_tuples]
VEGA_LITE_COLOR_SCHEME_MAP = {
    scheme: color for scheme, color in _vega_lite_scheme_tuples
}
VEGA_LITE_COLOR_SCHEMES_URL = (
    "https://vega.github.io/vega/docs/schemes/#categorical-schemes"
)

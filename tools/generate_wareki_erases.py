#!/usr/bin/env python3
"""Harumi gengo_periods.json から js/wareki.js の ERAS を生成する。

Harumi の to_gregorian は次元号の開始日（前元号の最終日はその前日）と解釈する。
データ: https://github.com/code4history/Harumi (MIT)
"""
from __future__ import annotations

import json
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JSON_PATH = ROOT / "tools" / "gengo_periods.json"
OUT_PATH = ROOT / "js" / "wareki.js"


def parse_g(s: str | None) -> date | None:
    if not s:
        return None
    parts = s.strip().split("-")
    y, m, d = int(parts[0]), int(parts[1]), int(parts[2])
    return date(y, m, d)


def prev_day(d: date) -> date:
    return d - timedelta(days=1)


def end_inclusive_for_row(
    to_str: str | None, from_next: date | None
) -> date | None:
    """Harumi の to は、次元号の開始日と同じ日か、当元号の最終日かの両方があり得る。

    次元号の開始日と同じなら前元号の最終日はその前日。そうでなければ to 自体が最終日（含む）。
    """
    if not to_str:
        return None
    to_d = parse_g(to_str)
    if from_next is not None and from_next == to_d:
        return prev_day(to_d)
    return to_d


def d_parts(d: date) -> list[int]:
    return [d.year, d.month, d.day]


def main() -> None:
    rows = json.loads(JSON_PATH.read_text(encoding="utf-8"))

    # 古い順に並べ、各行の「次の元号の開始日」を付与する
    rows_sorted = sorted(rows, key=lambda r: parse_g(r["from_gregorian"]))
    periods: list[tuple[str, date, date | None]] = []
    for i, r in enumerate(rows_sorted):
        main = r["main"]
        fs = parse_g(r["from_gregorian"])
        tg = r.get("to_gregorian")
        from_next = (
            parse_g(rows_sorted[i + 1]["from_gregorian"])
            if i + 1 < len(rows_sorted)
            else None
        )
        if not tg:
            te = None
        else:
            te = end_inclusive_for_row(tg, from_next)
        periods.append((main, fs, te))

    periods.sort(key=lambda x: x[1])

    merged: list[list] = []
    for main, fs, te in periods:
        if (
            merged
            and merged[-1][0] == main
            and merged[-1][2]
            and fs == merged[-1][2] + timedelta(days=1)
        ):
            merged[-1][2] = te
        else:
            merged.append([main, fs, te])

    # 同一 main が時期で分断されている場合は wareki.js の名前衝突を避ける
    seen: dict[str, int] = {}
    labeled: list[tuple[str, date, date | None]] = []
    for main, fs, te in merged:
        n = seen.get(main, 0)
        seen[main] = n + 1
        if n == 0:
            label = main
        else:
            label = main + "（" + str(n + 1) + "）"
        labeled.append((label, fs, te))

    # 新しい元号が先（令和 → … → 大宝）
    labeled.reverse()

    lines = [
        '(function () {',
        '  var WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];',
        "",
        "  /**",
        "   * 新しい元号が先。各期間はグレゴリオ暦の開始日・終了日（含む）。",
        "   * 境界は Harumi (code4history/Harumi) の gengo_periods.json に基づく。",
        "   * 旧暦改元の西暦対応は史料・対照表により異なる場合がある（参考用）。",
        "   * 同一元号名が時期で分かれる場合は「（2）」などで区別する。",
        "   */",
        "  var ERAS = [",
    ]

    for i, (name, fs, te) in enumerate(labeled):
        sp = d_parts(fs)
        if te is None:
            end_js = "null"
        else:
            ep = d_parts(te)
            end_js = "[" + ", ".join(str(x) for x in ep) + "]"
        comma = "," if i < len(labeled) - 1 else ""
        lines.append(
            '    { name: "'
            + name.replace("\\", "\\\\").replace('"', '\\"')
            + '", start: ['
            + ", ".join(str(x) for x in sp)
            + "], end: "
            + end_js
            + " }"
            + comma
        )

    lines.extend(
        [
            "  ];",
            "",
            "  var OLDEST = ERAS[ERAS.length - 1];",
            "",
            "  function toInt(y, m, d) {",
            "    return y * 10000 + m * 100 + d;",
            "  }",
            "",
            "  var MIN_GREGORIAN = toInt(",
            "    OLDEST.start[0],",
            "    OLDEST.start[1],",
            "    OLDEST.start[2]",
            "  );",
            "",
            "  function gregorianToWareki(y, m, d) {",
            "    var t = toInt(y, m, d);",
            "    if (t < MIN_GREGORIAN) return null;",
            "",
            "    for (var i = 0; i < ERAS.length; i++) {",
            "      var era = ERAS[i];",
            "      var sy = era.start[0],",
            "        sm = era.start[1],",
            "        sd = era.start[2];",
            "      var s = toInt(sy, sm, sd);",
            "      var e = era.end",
            "        ? toInt(era.end[0], era.end[1], era.end[2])",
            "        : 99991231;",
            "      if (t >= s && t <= e) {",
            "        var nen;",
            "        if (y === sy) nen = 1;",
            "        else nen = y - (sy - 1);",
            "        return { era: era.name, nen: nen, y: y, m: m, d: d };",
            "      }",
            "    }",
            "    return null;",
            "  }",
            "",
            "  function warekiToGregorian(eraName, nen, month, day) {",
            "    var era = null;",
            "    for (var j = 0; j < ERAS.length; j++) {",
            "      if (ERAS[j].name === eraName) {",
            "        era = ERAS[j];",
            "        break;",
            "      }",
            "    }",
            "    if (!era) return { error: \"元号を選んでください。\" };",
            "",
            "    var sy = era.start[0];",
            "    var gY = nen === 1 ? sy : sy - 1 + nen;",
            "    var dt = new Date(gY, month - 1, day);",
            "    if (",
            "      dt.getFullYear() !== gY ||",
            "      dt.getMonth() + 1 !== month ||",
            "      dt.getDate() !== day",
            "    ) {",
            '      return { error: "存在しない日付です。" };',
            "    }",
            "    var gy = dt.getFullYear(),",
            "      gm = dt.getMonth() + 1,",
            "      gd = dt.getDate();",
            "    var w = gregorianToWareki(gy, gm, gd);",
            "    if (!w || w.era !== eraName || w.nen !== nen) {",
            '      return { error: "その元号ではこの日付は使えません。" };',
            "    }",
            "    return { y: gy, m: gm, d: gd };",
            "  }",
            "",
            "  function formatWarekiLine(y, m, d) {",
            "    var w = gregorianToWareki(y, m, d);",
            "    if (!w) return null;",
            "    var wd = WEEKDAYS[new Date(y, m - 1, d).getDay()];",
            '    var ylabel = w.nen === 1 ? "元" : String(w.nen);',
            "    return (",
            '      w.era + ylabel + "年 " + m + "月" + d + "日（" + wd + "）"',
            "    );",
            "  }",
            "",
            "  function formatGregorianLine(y, m, d) {",
            '    var wd = WEEKDAYS[new Date(y, m - 1, d).getDay()];',
            '    return y + "年" + m + "月" + d + "日（" + wd + "）";',
            "  }",
            "",
            "  function oldestStartMessage() {",
            "    var s = OLDEST.start;",
            "    return (",
            '      s[0] +',
            '      "年" +',
            '      s[1] +',
            '      "月" +',
            '      s[2] +',
            '      "日より前の日付は、このツールでは未対応です。"',
            "    );",
            "  }",
            "",
            "  window.WarekiConvert = {",
            "    ERAS: ERAS,",
            "    gregorianToWareki: gregorianToWareki,",
            "    warekiToGregorian: warekiToGregorian,",
            "    formatWarekiLine: formatWarekiLine,",
            "    formatGregorianLine: formatGregorianLine,",
            "    oldestStartMessage: oldestStartMessage,",
            "  };",
            "})();",
            "",
        ]
    )

    OUT_PATH.write_text("\n".join(lines), encoding="utf-8")
    print("Wrote", OUT_PATH, "eras", len(labeled))


if __name__ == "__main__":
    main()

(function () {
  var WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

  /**
   * 新しい元号が先。各期間はグレゴリオ暦の開始日・終了日（含む）。
   * 境界は Harumi (code4history/Harumi) の gengo_periods.json に基づく。
   * 旧暦改元の西暦対応は史料・対照表により異なる場合がある（参考用）。
   * 同一元号名が時期で分かれる場合は「（2）」などで区別する。
   */
  var ERAS = [
    { name: "令和", start: [2019, 5, 1], end: null },
    { name: "平成", start: [1989, 1, 8], end: [2019, 4, 30] },
    { name: "昭和", start: [1926, 12, 25], end: [1989, 1, 7] },
    { name: "大正", start: [1912, 7, 30], end: [1926, 12, 24] },
    { name: "明治", start: [1868, 10, 23], end: [1912, 7, 29] },
    { name: "慶応", start: [1865, 5, 1], end: [1868, 10, 22] },
    { name: "元治", start: [1864, 3, 27], end: [1865, 4, 30] },
    { name: "文久", start: [1861, 3, 29], end: [1864, 3, 26] },
    { name: "万延", start: [1860, 4, 8], end: [1861, 3, 28] },
    { name: "安政", start: [1855, 1, 15], end: [1860, 4, 7] },
    { name: "嘉永", start: [1848, 4, 1], end: [1855, 1, 14] },
    { name: "弘化", start: [1845, 1, 9], end: [1848, 3, 31] },
    { name: "天保", start: [1831, 1, 23], end: [1845, 1, 8] },
    { name: "文政", start: [1818, 5, 26], end: [1831, 1, 22] },
    { name: "文化", start: [1804, 3, 22], end: [1818, 5, 25] },
    { name: "享和", start: [1801, 3, 19], end: [1804, 3, 21] },
    { name: "寛政", start: [1789, 2, 19], end: [1801, 3, 18] },
    { name: "天明", start: [1781, 4, 25], end: [1789, 2, 18] },
    { name: "安永", start: [1772, 12, 10], end: [1781, 4, 24] },
    { name: "明和", start: [1764, 6, 30], end: [1772, 12, 9] },
    { name: "宝暦", start: [1751, 12, 14], end: [1764, 6, 29] },
    { name: "寛延", start: [1748, 8, 5], end: [1751, 12, 13] },
    { name: "延享", start: [1744, 4, 3], end: [1748, 8, 4] },
    { name: "寛保", start: [1741, 4, 12], end: [1744, 4, 2] },
    { name: "元文", start: [1736, 6, 7], end: [1741, 4, 11] },
    { name: "享保", start: [1716, 8, 9], end: [1736, 6, 6] },
    { name: "正徳", start: [1711, 6, 11], end: [1716, 8, 8] },
    { name: "宝永", start: [1704, 4, 16], end: [1711, 6, 10] },
    { name: "元禄", start: [1688, 10, 23], end: [1704, 4, 15] },
    { name: "貞享", start: [1684, 4, 5], end: [1688, 10, 22] },
    { name: "天和", start: [1681, 11, 9], end: [1684, 4, 4] },
    { name: "延宝", start: [1673, 10, 30], end: [1681, 11, 8] },
    { name: "寛文", start: [1661, 5, 23], end: [1673, 10, 29] },
    { name: "万治", start: [1658, 8, 21], end: [1661, 5, 22] },
    { name: "明暦", start: [1655, 5, 18], end: [1658, 8, 20] },
    { name: "承応", start: [1652, 10, 20], end: [1655, 5, 17] },
    { name: "慶安", start: [1648, 4, 7], end: [1652, 10, 19] },
    { name: "正保", start: [1645, 1, 13], end: [1648, 4, 6] },
    { name: "寛永", start: [1624, 4, 17], end: [1645, 1, 12] },
    { name: "元和", start: [1615, 9, 5], end: [1624, 4, 16] },
    { name: "慶長", start: [1596, 12, 16], end: [1615, 9, 4] },
    { name: "文禄", start: [1593, 1, 10], end: [1596, 12, 15] },
    { name: "天正", start: [1573, 9, 4], end: [1593, 1, 9] },
    { name: "元亀", start: [1570, 6, 6], end: [1573, 9, 3] },
    { name: "永禄", start: [1558, 3, 28], end: [1570, 6, 5] },
    { name: "弘治", start: [1555, 11, 17], end: [1558, 3, 27] },
    { name: "天文", start: [1532, 9, 8], end: [1555, 11, 16] },
    { name: "享禄", start: [1528, 9, 13], end: [1532, 9, 7] },
    { name: "大永", start: [1521, 10, 3], end: [1528, 9, 12] },
    { name: "永正", start: [1504, 3, 26], end: [1521, 10, 2] },
    { name: "文亀", start: [1501, 3, 28], end: [1504, 3, 25] },
    { name: "明応", start: [1492, 8, 21], end: [1501, 3, 27] },
    { name: "延徳", start: [1489, 9, 25], end: [1492, 8, 20] },
    { name: "長享", start: [1487, 8, 18], end: [1489, 9, 24] },
    { name: "文明", start: [1469, 6, 17], end: [1487, 8, 17] },
    { name: "応仁", start: [1467, 4, 18], end: [1469, 6, 16] },
    { name: "文正", start: [1466, 3, 23], end: [1467, 4, 17] },
    { name: "寛正", start: [1461, 2, 10], end: [1466, 3, 22] },
    { name: "長禄", start: [1457, 10, 25], end: [1461, 2, 9] },
    { name: "康正", start: [1455, 9, 15], end: [1457, 10, 24] },
    { name: "享徳", start: [1452, 8, 19], end: [1455, 9, 14] },
    { name: "宝徳", start: [1449, 8, 25], end: [1452, 8, 18] },
    { name: "文安", start: [1444, 3, 3], end: [1449, 8, 24] },
    { name: "嘉吉", start: [1441, 3, 19], end: [1444, 3, 2] },
    { name: "永享", start: [1429, 10, 12], end: [1441, 3, 18] },
    { name: "正長", start: [1428, 6, 19], end: [1429, 10, 11] },
    { name: "応永", start: [1394, 8, 10], end: [1428, 6, 18] },
    { name: "明徳", start: [1392, 11, 28], end: [1394, 8, 9] },
    { name: "元中", start: [1384, 5, 26], end: [1392, 11, 27] },
    { name: "弘和", start: [1381, 3, 14], end: [1384, 5, 25] },
    { name: "天授", start: [1375, 7, 4], end: [1381, 3, 13] },
    { name: "文中", start: [1372, 5, 12], end: [1375, 7, 3] },
    { name: "建徳", start: [1370, 8, 24], end: [1372, 5, 11] },
    { name: "正平", start: [1347, 1, 28], end: [1370, 8, 23] },
    { name: "興国", start: [1340, 6, 2], end: [1347, 1, 27] },
    { name: "延元", start: [1336, 4, 19], end: [1340, 6, 1] },
    { name: "建武", start: [1334, 3, 13], end: [1336, 4, 18] },
    { name: "元弘", start: [1331, 9, 19], end: [1334, 3, 12] },
    { name: "元徳", start: [1329, 9, 30], end: [1331, 9, 18] },
    { name: "嘉暦", start: [1326, 6, 5], end: [1329, 9, 29] },
    { name: "正中", start: [1325, 1, 2], end: [1326, 6, 4] },
    { name: "元亨", start: [1321, 3, 30], end: [1325, 1, 1] },
    { name: "元応", start: [1319, 5, 26], end: [1321, 3, 29] },
    { name: "文保", start: [1317, 3, 24], end: [1319, 5, 25] },
    { name: "正和", start: [1312, 5, 5], end: [1317, 3, 23] },
    { name: "応長", start: [1311, 5, 25], end: [1312, 5, 4] },
    { name: "延慶", start: [1308, 11, 30], end: [1311, 5, 24] },
    { name: "徳治", start: [1307, 1, 26], end: [1308, 11, 29] },
    { name: "嘉元", start: [1303, 9, 24], end: [1307, 1, 25] },
    { name: "乾元", start: [1302, 12, 18], end: [1303, 9, 23] },
    { name: "正安", start: [1299, 6, 1], end: [1302, 12, 17] },
    { name: "永仁", start: [1293, 9, 13], end: [1299, 5, 31] },
    { name: "正応", start: [1288, 6, 5], end: [1293, 9, 12] },
    { name: "弘安", start: [1278, 3, 30], end: [1288, 6, 4] },
    { name: "建治", start: [1275, 5, 29], end: [1278, 3, 29] },
    { name: "文永", start: [1264, 4, 3], end: [1275, 5, 28] },
    { name: "弘長", start: [1261, 3, 29], end: [1264, 4, 2] },
    { name: "文応", start: [1260, 5, 31], end: [1261, 3, 28] },
    { name: "正元", start: [1259, 4, 27], end: [1260, 5, 30] },
    { name: "正嘉", start: [1257, 4, 7], end: [1259, 4, 26] },
    { name: "康元", start: [1256, 10, 31], end: [1257, 4, 6] },
    { name: "建長", start: [1249, 5, 9], end: [1256, 10, 30] },
    { name: "宝治", start: [1247, 4, 12], end: [1249, 5, 8] },
    { name: "寛元", start: [1243, 3, 25], end: [1247, 4, 11] },
    { name: "仁治", start: [1240, 8, 12], end: [1243, 3, 24] },
    { name: "延応", start: [1239, 3, 20], end: [1240, 8, 11] },
    { name: "暦仁", start: [1239, 1, 6], end: [1239, 3, 19] },
    { name: "嘉禎", start: [1235, 11, 8], end: [1239, 1, 5] },
    { name: "文暦", start: [1234, 12, 4], end: [1235, 11, 7] },
    { name: "天福", start: [1233, 6, 1], end: [1234, 12, 3] },
    { name: "貞永", start: [1232, 4, 30], end: [1233, 5, 31] },
    { name: "寛喜", start: [1229, 4, 7], end: [1232, 4, 29] },
    { name: "安貞", start: [1228, 1, 25], end: [1229, 4, 6] },
    { name: "嘉禄", start: [1225, 6, 4], end: [1228, 1, 24] },
    { name: "元仁", start: [1225, 1, 7], end: [1225, 6, 3] },
    { name: "貞応", start: [1222, 6, 1], end: [1225, 1, 6] },
    { name: "承久", start: [1219, 6, 3], end: [1222, 5, 31] },
    { name: "建保", start: [1214, 1, 25], end: [1219, 6, 2] },
    { name: "建暦", start: [1211, 4, 30], end: [1214, 1, 24] },
    { name: "承元", start: [1207, 11, 23], end: [1211, 4, 29] },
    { name: "建永", start: [1206, 6, 12], end: [1207, 11, 22] },
    { name: "元久", start: [1204, 3, 30], end: [1206, 6, 11] },
    { name: "建仁", start: [1201, 3, 26], end: [1204, 3, 29] },
    { name: "正治", start: [1199, 5, 30], end: [1201, 3, 25] },
    { name: "建久", start: [1190, 5, 23], end: [1199, 5, 29] },
    { name: "文治", start: [1185, 9, 16], end: [1190, 5, 22] },
    { name: "元暦", start: [1184, 6, 3], end: [1185, 9, 15] },
    { name: "寿永", start: [1182, 7, 6], end: [1184, 6, 2] },
    { name: "養和", start: [1181, 9, 1], end: [1182, 7, 5] },
    { name: "治承", start: [1177, 9, 5], end: [1181, 8, 31] },
    { name: "安元", start: [1175, 8, 23], end: [1177, 9, 4] },
    { name: "承安", start: [1171, 6, 3], end: [1175, 8, 22] },
    { name: "嘉応", start: [1169, 5, 13], end: [1171, 6, 2] },
    { name: "仁安", start: [1166, 9, 30], end: [1169, 5, 12] },
    { name: "永万", start: [1165, 7, 21], end: [1166, 9, 29] },
    { name: "長寛", start: [1163, 5, 11], end: [1165, 7, 20] },
    { name: "応保", start: [1161, 10, 1], end: [1163, 5, 10] },
    { name: "永暦", start: [1160, 2, 25], end: [1161, 9, 30] },
    { name: "平治", start: [1159, 5, 16], end: [1160, 2, 24] },
    { name: "保元", start: [1156, 5, 25], end: [1159, 5, 15] },
    { name: "久寿", start: [1154, 12, 11], end: [1156, 5, 24] },
    { name: "仁平", start: [1151, 2, 21], end: [1154, 12, 10] },
    { name: "久安", start: [1145, 8, 19], end: [1151, 2, 20] },
    { name: "天養", start: [1144, 4, 4], end: [1145, 8, 18] },
    { name: "康治", start: [1142, 6, 1], end: [1144, 4, 3] },
    { name: "永治", start: [1141, 8, 20], end: [1142, 5, 31] },
    { name: "保延", start: [1135, 6, 17], end: [1141, 8, 19] },
    { name: "長承", start: [1132, 9, 28], end: [1135, 6, 16] },
    { name: "天承", start: [1131, 3, 7], end: [1132, 9, 27] },
    { name: "大治", start: [1126, 2, 22], end: [1131, 3, 6] },
    { name: "天治", start: [1124, 5, 25], end: [1126, 2, 21] },
    { name: "保安", start: [1120, 5, 16], end: [1124, 5, 24] },
    { name: "元永", start: [1118, 5, 2], end: [1120, 5, 15] },
    { name: "永久", start: [1113, 9, 1], end: [1118, 5, 1] },
    { name: "天永", start: [1110, 8, 7], end: [1113, 8, 31] },
    { name: "天仁", start: [1108, 9, 16], end: [1110, 8, 6] },
    { name: "嘉承", start: [1106, 5, 20], end: [1108, 9, 15] },
    { name: "長治", start: [1104, 3, 15], end: [1106, 5, 19] },
    { name: "康和", start: [1099, 9, 21], end: [1104, 3, 14] },
    { name: "承徳", start: [1098, 1, 2], end: [1099, 9, 20] },
    { name: "永長", start: [1097, 1, 9], end: [1098, 1, 1] },
    { name: "嘉保", start: [1095, 1, 29], end: [1097, 1, 8] },
    { name: "寛治", start: [1087, 5, 17], end: [1095, 1, 28] },
    { name: "応徳", start: [1084, 3, 21], end: [1087, 5, 16] },
    { name: "永保", start: [1081, 3, 28], end: [1084, 3, 20] },
    { name: "承暦", start: [1077, 12, 11], end: [1081, 3, 27] },
    { name: "承保", start: [1074, 9, 22], end: [1077, 12, 10] },
    { name: "延久", start: [1069, 5, 12], end: [1074, 9, 21] },
    { name: "治暦", start: [1065, 9, 10], end: [1069, 5, 11] },
    { name: "康平", start: [1058, 9, 25], end: [1065, 9, 9] },
    { name: "天喜", start: [1053, 2, 8], end: [1058, 9, 24] },
    { name: "永承", start: [1046, 5, 28], end: [1053, 2, 7] },
    { name: "寛徳", start: [1044, 12, 22], end: [1046, 5, 27] },
    { name: "長久", start: [1040, 12, 22], end: [1044, 12, 21] },
    { name: "長暦", start: [1037, 5, 15], end: [1040, 12, 21] },
    { name: "長元", start: [1028, 8, 24], end: [1037, 5, 14] },
    { name: "万寿", start: [1024, 8, 25], end: [1028, 8, 23] },
    { name: "治安", start: [1021, 3, 23], end: [1024, 8, 24] },
    { name: "寛仁", start: [1017, 5, 27], end: [1021, 3, 22] },
    { name: "長和", start: [1013, 2, 14], end: [1017, 5, 26] },
    { name: "寛弘", start: [1004, 8, 14], end: [1013, 2, 13] },
    { name: "長保", start: [999, 2, 6], end: [1004, 8, 13] },
    { name: "長徳", start: [995, 3, 30], end: [999, 2, 5] },
    { name: "正暦", start: [990, 12, 1], end: [995, 3, 29] },
    { name: "永祚", start: [989, 9, 15], end: [990, 11, 30] },
    { name: "永延", start: [987, 5, 10], end: [989, 9, 14] },
    { name: "寛和", start: [985, 5, 24], end: [987, 5, 9] },
    { name: "永観", start: [983, 6, 3], end: [985, 5, 23] },
    { name: "天元", start: [979, 1, 5], end: [983, 6, 2] },
    { name: "貞元", start: [976, 8, 16], end: [979, 1, 4] },
    { name: "天延", start: [974, 1, 21], end: [976, 8, 15] },
    { name: "天禄", start: [970, 5, 8], end: [974, 1, 20] },
    { name: "安和", start: [968, 9, 13], end: [970, 5, 7] },
    { name: "康保", start: [964, 8, 24], end: [968, 9, 12] },
    { name: "応和", start: [961, 3, 10], end: [964, 8, 23] },
    { name: "天徳", start: [957, 11, 26], end: [961, 3, 9] },
    { name: "天暦", start: [947, 5, 20], end: [957, 11, 25] },
    { name: "天慶", start: [938, 6, 27], end: [947, 5, 19] },
    { name: "承平", start: [931, 5, 21], end: [938, 6, 26] },
    { name: "延長", start: [923, 6, 3], end: [931, 5, 20] },
    { name: "延喜", start: [901, 9, 5], end: [923, 6, 2] },
    { name: "昌泰", start: [898, 5, 24], end: [901, 9, 4] },
    { name: "寛平", start: [889, 6, 3], end: [898, 5, 23] },
    { name: "仁和", start: [885, 3, 15], end: [889, 6, 2] },
    { name: "元慶", start: [877, 6, 5], end: [885, 3, 14] },
    { name: "貞観", start: [859, 5, 24], end: [877, 6, 4] },
    { name: "天安", start: [857, 3, 24], end: [859, 5, 23] },
    { name: "斉衡", start: [854, 12, 27], end: [857, 3, 23] },
    { name: "仁寿", start: [851, 6, 5], end: [854, 12, 26] },
    { name: "嘉祥", start: [848, 7, 20], end: [851, 6, 4] },
    { name: "承和", start: [834, 2, 18], end: [848, 7, 19] },
    { name: "天長", start: [824, 2, 12], end: [834, 2, 17] },
    { name: "弘仁", start: [810, 10, 24], end: [824, 2, 11] },
    { name: "大同", start: [806, 6, 12], end: [810, 10, 23] },
    { name: "延暦", start: [782, 10, 4], end: [806, 6, 11] },
    { name: "天応", start: [781, 2, 3], end: [782, 10, 3] },
    { name: "宝亀", start: [770, 10, 27], end: [781, 2, 2] },
    { name: "神護景雲", start: [767, 9, 17], end: [770, 10, 26] },
    { name: "天平神護", start: [765, 2, 5], end: [767, 9, 16] },
    { name: "天平宝字", start: [757, 9, 10], end: [765, 2, 4] },
    { name: "天平勝宝", start: [749, 8, 23], end: [757, 9, 9] },
    { name: "天平感宝", start: [749, 5, 8], end: [749, 8, 22] },
    { name: "天平", start: [729, 9, 6], end: [749, 5, 7] },
    { name: "神亀", start: [724, 3, 7], end: [729, 9, 5] },
    { name: "養老", start: [717, 12, 28], end: [724, 3, 6] },
    { name: "霊亀", start: [715, 10, 7], end: [717, 12, 27] },
    { name: "和銅", start: [708, 2, 11], end: [715, 10, 6] },
    { name: "慶雲", start: [704, 6, 20], end: [708, 2, 10] },
    { name: "大宝", start: [701, 5, 7], end: [704, 6, 19] }
  ];

  var OLDEST = ERAS[ERAS.length - 1];

  function toInt(y, m, d) {
    return y * 10000 + m * 100 + d;
  }

  var MIN_GREGORIAN = toInt(
    OLDEST.start[0],
    OLDEST.start[1],
    OLDEST.start[2]
  );

  function gregorianToWareki(y, m, d) {
    var t = toInt(y, m, d);
    if (t < MIN_GREGORIAN) return null;

    for (var i = 0; i < ERAS.length; i++) {
      var era = ERAS[i];
      var sy = era.start[0],
        sm = era.start[1],
        sd = era.start[2];
      var s = toInt(sy, sm, sd);
      var e = era.end
        ? toInt(era.end[0], era.end[1], era.end[2])
        : 99991231;
      if (t >= s && t <= e) {
        var nen;
        if (y === sy) nen = 1;
        else nen = y - (sy - 1);
        return { era: era.name, nen: nen, y: y, m: m, d: d };
      }
    }
    return null;
  }

  function warekiToGregorian(eraName, nen, month, day) {
    var era = null;
    for (var j = 0; j < ERAS.length; j++) {
      if (ERAS[j].name === eraName) {
        era = ERAS[j];
        break;
      }
    }
    if (!era) return { error: "元号を選んでください。" };

    var sy = era.start[0];
    var gY = nen === 1 ? sy : sy - 1 + nen;
    var dt = new Date(gY, month - 1, day);
    if (
      dt.getFullYear() !== gY ||
      dt.getMonth() + 1 !== month ||
      dt.getDate() !== day
    ) {
      return { error: "存在しない日付です。" };
    }
    var gy = dt.getFullYear(),
      gm = dt.getMonth() + 1,
      gd = dt.getDate();
    var w = gregorianToWareki(gy, gm, gd);
    if (!w || w.era !== eraName || w.nen !== nen) {
      return { error: "その元号ではこの日付は使えません。" };
    }
    return { y: gy, m: gm, d: gd };
  }

  function formatWarekiLine(y, m, d) {
    var w = gregorianToWareki(y, m, d);
    if (!w) return null;
    var wd = WEEKDAYS[new Date(y, m - 1, d).getDay()];
    var ylabel = w.nen === 1 ? "元" : String(w.nen);
    return (
      w.era + ylabel + "年 " + m + "月" + d + "日（" + wd + "）"
    );
  }

  function formatGregorianLine(y, m, d) {
    var wd = WEEKDAYS[new Date(y, m - 1, d).getDay()];
    return y + "年" + m + "月" + d + "日（" + wd + "）";
  }

  function oldestStartMessage() {
    var s = OLDEST.start;
    return (
      s[0] +
      "年" +
      s[1] +
      "月" +
      s[2] +
      "日より前の日付は、このツールでは未対応です。"
    );
  }

  window.WarekiConvert = {
    ERAS: ERAS,
    gregorianToWareki: gregorianToWareki,
    warekiToGregorian: warekiToGregorian,
    formatWarekiLine: formatWarekiLine,
    formatGregorianLine: formatGregorianLine,
    oldestStartMessage: oldestStartMessage,
  };
})();

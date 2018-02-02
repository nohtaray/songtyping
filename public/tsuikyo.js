/**
 * tsuikyo.js v2.0.2 - typing game module for web apps
 * http://dvorak.jp/softwares/tsuikyo.htm
 *
 * Copyright 2010, Shutaro Takimoto <wh@dvorak.jp>
 * Licensed under the MIT license
 * https://opensource.org/licenses/MIT
 */
(function(exportName) {
	var Tsuikyo, Word, Node, __defaultOpts, __browser, __os, __embed;
	__defaultOpts = {
		kbd: "jp",
		map: "qwejp",
		im: "roma",
		flex: "flex",
		eventRoot: window.document,
		prevent: false,
		strictParse: false,
		report: false
	};

	// detect the browser and os from UA
	// modified jquery.client.js (public domain) : http://www.quirksmode.org/js/detect.html
	__browser = (function() {
		var ret = {}, ua = navigator.userAgent, nv = navigator.vendor, na = navigator.appVersion, d, bn, bv, ds, dp, vs, idx, c, i, fn;
		d = [	// ** order-sensitive! **
			{
				s: ua,
				sub: "Chrome",
				id: "Chrome"
			},{
				s: ua,
				sub: "OmniWeb",
				ver: "OmniWeb/",
				id: "OmniWeb"
			},{
				s: nv,
				sub: "Apple",
				id: "Safari",
				ver: "Version"
			},{		// Opera 10+
				prop: window.opera,
				id: "Opera",
				ver: "Version"
			},{		// Opera -9
				prop: window.opera,
				id: "Opera"
			},{
				s: nv,
				sub: "iCab",
				id: "iCab"
			},{
				s: nv,
				sub: "KDE",
				id: "Konqueror"
			},{
				s: ua,
				sub: "Firefox",
				id: "Firefox"
			},{		// Firefox trunk build
				s: ua,
				sub: "Minefield",
				id: "Firefox",
				ver: "Minefield"
			},{		// Firefox 1 branch build
				s: ua,
				sub: "Phoenix",
				id: "Firefox",
				ver: "Phoenix"
			},{		// Firefox 2 branch build
				s: ua,
				sub: "BonEcho",
				id: "Firefox",
				ver: "BonEcho"
			},{		// Firefox 3 branch build
				s: ua,
				sub: "GranParadiso",
				id: "Firefox",
				ver: "GranParadiso"
			},{		// Firefox 3.5 branch build
				s: ua,
				sub: "Shiretoko",
				id: "Firefox",
				ver: "Shiretoko"
			},{		// Firefox 3.6 branch build
				s: ua,
				sub: "Namoroka",
				id: "Firefox",
				ver: "Namoroka"
			},{		// Firefox 3.7 branch build
				s: ua,
				sub: "Lorentz",
				id: "Firefox",
				ver: "Lorentz"
			},{		// Firefox for Debian
				s: ua,
				sub: "Iceweasel",
				id: "Firefox",
				ver: "Iceweasel"
			},{		// Firefox in GNU
				s: ua,
				sub: "IceCat",
				id: "Firefox",
				ver: "IceCat"
			},{
				s: nv,
				sub: "Camino",
				id: "Camino"
			},{		// for Netscape 6
				s: ua,
				sub: "Netscape6",
				id: "Netscape6"
			},{		// for newer Netscapes (7-)
				s: ua,
				sub: "Netscape",
				id: "Netscape6"
			},{
				s: ua,
				sub: "MSIE",
				id: "IE",
				ver: "MSIE"
			},{		// unknown but gecko
				s: ua,
				sub: "Gecko",
				id: "Mozilla",
				ver: "rv"
			},{		// for older Netscapes (4-)
				s: ua,
				sub: "Mozilla",
				id: "Netscape",
				ver: "Mozilla"
			}
		];

		fn = function() {
			return (c++ === 1) ? '' : '.';
		};

		for (i = 0; i < d.length; ++i) {
			ds = d[i].s;
			dp = d[i].prop;
			if (ds && ds.indexOf(d[i].sub) !== -1 || dp) {
				vs = d[i].ver || d[i].id;
				bn = d[i].id;
				c = 0;
				if ((idx = ua.indexOf(vs)) !== -1) {
					bv = parseFloat(ua.slice(idx + vs.length + 1).replace(/\./g, fn));
					break;
				} else if ((idx = na.indexOf(vs)) !== -1) {
					bv = parseFloat(na.slice(idx + vs.length + 1).replace(/\./g, fn));
					break;
				} else {
					bv = -1;
				}
			}
		}

		if (bn) {
			bn = bn.toLowerCase();
			ret.name = bn;
			ret.version = bv;
			ret[bn] = bv;
		} else {
			ret.name = "unknown";
			ret.version = -1;
			ret.unknown = -1;
		}

		return ret;
	})();
	__os = (function() {
		var ret = {}, os, ds, idx, c, i, d, ua = navigator.userAgent, np = navigator.platform;
		d = [
			{
				s: np,
				sub: "Win",
				id: "Windows"
			},{
				s: np,
				sub: "Mac",
				id: "Mac"
			},{
				s: ua,
				sub: "iPhone",
				id: "iOS"
		    },{
				s: np,
				sub: "Linux",
				id: "Unix"
			},{
				s: np,
				sub: "SunOS",
				id: "Unix"
			},{
				s: np,
				sub: "BSD",
				id: "Unix"
			},{
				s: ua,
				sub: "X11",
				id: "Unix"
			}
		];

		for (i = 0; i < d.length; ++i) {
			ds = d[i].s;

			if (ds && ds.indexOf(d[i].sub) !== -1) {
				os = d[i].id;
				break;
			}
		}

		if (os) {
			os = os.toLowerCase();
			ret.name = os;
			ret[os] = true;
		} else {
			ret.name = "unknown";
			ret.unknown = true;
		}

		return ret;
	})();

	// embedded data
	__embed = (function() {
		var kbd, map, im;
		kbd = {};		// identify physical keycode
		map = {};		// convert keycode to keysym
		im = {};		// make the automaton which accept keysyms

		kbd.jp = (function() {
			var keypressTableBase, keypressTable, keydownTable;
			keypressTableBase = {
			     33: 49,	// ! -> 1
			     34: 50,	// " -> 2
			     35: 51,	// # -> 3
			     36: 52,	// $ -> 4
			     37: 53,	// % -> 5
			     38: 54,	// & -> 6
			     39: 55,	// ' -> 7
			     40: 56,	// ( -> 8
			     41: 57,	// ) -> 9
			     42:186,	// * -> OEM_1
			     43:187,	// + -> OEM_PLUS
			     44:188,	// , -> OEM_COMMA
			     45:189,	// - -> OEM_MINUS
			     46:190,	// . -> OEM_PERIOD
			     47:191,	// / -> OEM_2
			     58:186,	// : -> OEM_1
			     59:187,	// ; -> OEM_PLUS
			     60:188,	// < -> OEM_COMMA
			     61:180,	// = -> OEM_MINUS
			     62:190,	// > -> OEM_PERIOD
			     63:191,	// ? -> OEM_2
			     64:192,	// @ -> OEM_3
			     91:219,	// [ -> OEM_4
			     92:220,	// \ -> OEM_5
			     93:221,	// ] -> OEM_6
			     94:222,	// ^ -> OEM_7
			     95:226,	// _ -> OEM_102
			     96:192,	// ` -> OEM_3
			     97: 65,	// a -> A
			     98: 66,	// b -> B
			     99: 67,	// c -> C
			    100: 68,	// d -> D
			    101: 69,	// e -> E
			    102: 70,	// f -> F
			    103: 71,	// g -> G
			    104: 72,	// h -> H
			    105: 73,	// i -> I
			    106: 74,	// j -> J
			    107: 75,	// k -> K
			    108: 76,	// l -> L
			    109: 77,	// m -> M
			    110: 78,	// n -> N
			    111: 79,	// o -> O
			    112: 80,	// p -> P
			    113: 81,	// q -> Q
			    114: 82,	// r -> R
			    115: 83,	// s -> S
			    116: 84,	// t -> T
			    117: 85,	// u -> U
			    118: 86,	// v -> V
			    119: 87,	// w -> W
			    120: 88,	// x -> X
			    121: 89,	// y -> Y
			    122: 90,	// z -> Z
			    123:219,	// { -> OEM_4
			    124:220,	// | -> OEM_5
			    125:221,	// } -> OEM_6
			    126:222		// ~ -> OEM_7
			};
			keypressTable = (function(b, v) {
				var t = keypressTableBase;

				switch (b) {
					case "firefox":
						t[43] = function(env) {
							if (env.shift) {
								return 187;	// OEM_PLUS
							} else {
								return 107;	// NUM_PLUS
							}
						};
						break;
					default:
						break;
				}

				return t;
			})(__browser.name, __browser.version);
			keydownTable = (function(b, v) {
				var i, t = {};

				switch (b) {
					case "ie":
						t[243] = 244;		// HanZen
						break;
					case "netscape6":
						// treat Netscape as Firefox
						v = 1;
						// ** FALL THROUGH **
					case "firefox":
						t[109] = 189;		// -
						t[173] = 189;		// - (fx 15.0+)
						t[59] = 186;		// :

						if (v >= 3) {
							t[107] = -1;	// ;, num+ -> [keypress]
							t[243] = 244;	// HanZen
						} else {
							t[61] = 187;	// ;
							t[229] = 244;	// HanZen, Henkan, Kana -> HanZen
						}
						break;
					case "chrome":
						t[243] = 244;		// HanZen
						t[229] = 244;		// HanZen
						break;
					case "safari":
						if (v >= 5) {
							t[229] = 244;	// HanZen
						} else {
							t[229] = 244;	// HanZen, Henkan, Kana -> HanZen
						}
						break;
					case "opera":
						t[0] = 93;			// menu
						t[42] = 106;		// num*
						t[43] = 107;		// num+
						t[47] = 111;		// num/
						t[78] = -1;			// n, numDot -> n
						t[208] = 240;		// Eisu
						for (i = 48; i <= 57; ++i) {
							t[i] = i;		// num0 ~ num9 -> 0-9
						}
						if (v < 9.5) {
							t[44] = 188;	// ,
							t[45] = 189;	// -, ins, num- -> hyphen
							t[46] = 190;	// dot, del -> dot
							t[47] = 191;	// /
							t[58] = 186;	// :
							t[59] = 187;	// ;
							t[64] = 192;	// @
							t[91] = 219;	// [, LWin -> [
							t[92] = 220;	// \|, \_, RWin -> \|
							t[93] = 221;	// ]
							t[94] = 222;	// ^
						} else {
							t[45] = 109;	// num-, ins -> num-
							t[50] = -1;		// @, 2, num2 -> [keypress]
							t[54] = -1;		// ^, 6, num6 -> [keypress]
							t[59] = -1;		// ;, : -> [keypress]
							t[109] = 189;	// -
							t[219] = 219;	// [, LWin, RWin -> [
							t[220] = 220;	// \|, \_ -> \|
						}
						if (v < 10) {
							t[197] = 244;	// HanZen, Henkan, Kana -> HanZen
						} else {
							t[210] = 242;	// Kana
							t[211] = 244;	// HanZen
							t[212] = 244;	// HanZen
						}
						break;
					default:
						break;
				}

				return t;
			})(__browser.name, __browser.version);

			return function(c, env) {
				var orig = c;

				switch (env.type) {
					case "keydown":
					case "keyup":
						c = keydownTable[c];
						break;
					case "keypress":
						c = keypressTable[c];
						if (c instanceof Function) {
							c = c(env);
						}
						break;
					default:
						if (env.report) {
							throw new Error("unknown event type");
						}
						break;
				}
				return c || orig;
			};
		})();
		kbd.us = void 0;	// !TODO

		map.qwejp = {
			48: ["0", "0"],
			49: ["1", "!"],
			50: ["2", '"'],
			51: ["3", "#"],
			52: ["4", "$"],
			53: ["5", "%"],
			54: ["6", "&"],
			55: ["7", "'"],
			56: ["8", "("],
			57: ["9", ")"],
			65: ["a", "A"],
			66: ["b", "B"],
			67: ["c", "C"],
			68: ["d", "D"],
			69: ["e", "E"],
			70: ["f", "F"],
			71: ["g", "G"],
			72: ["h", "H"],
			73: ["i", "I"],
			74: ["j", "J"],
			75: ["k", "K"],
			76: ["l", "L"],
			77: ["m", "M"],
			78: ["n", "N"],
			79: ["o", "O"],
			80: ["p", "P"],
			81: ["q", "Q"],
			82: ["r", "R"],
			83: ["s", "S"],
			84: ["t", "T"],
			85: ["u", "U"],
			86: ["v", "V"],
			87: ["w", "W"],
			88: ["x", "X"],
			89: ["y", "Y"],
			90: ["z", "Z"],
			189: ["-", "="],
			222: ["^", "~"],
			220: ["\\", "|"],
			192: ["@", "`"],
			219: ["[", "{"],
			187: [";", "+"],
			186: [":", "*"],
			221: ["]", "}"],
			188: [",", "<"],
			190: [".", ">"],
			191: ["/", "?"],
			226: ["\\", "_"],
			112: ["F1", "F1"],
			113: ["F2", "F2"],
			114: ["F3", "F3"],
			115: ["F4", "F4"],
			116: ["F5", "F5"],
			117: ["F6", "F6"],
			118: ["F7", "F7"],
			119: ["F8", "F8"],
			120: ["F9", "F9"],
			121: ["F10", "F10"],
			122: ["F11", "F11"],
			123: ["F12", "F12"],
			124: ["F13", "F13"],
			125: ["F14", "F14"],
			126: ["F15", "F15"],
			127: ["F16", "F16"],
			27: ["Esc", "Esc"],
			9: [["Tab", "\t"], ["Tab", "\t"]],
			16: ["Shift", "Shift"],
			17: ["Ctrl", "Ctrl"],
			18: ["Alt", "Alt"],
			91: ["LWin", "LWin"],
			92: ["RWin", "RWin"],
			93: ["Menu", "Menu"],
			244: ["IME", "IME"],
			25: ["IME", "IME"],
			240: ["Eisu", "Eisu"],
			20: ["CapsLock", "CapsLock"],
			29: ["Muhenkan", "Muhenkan"],
			28: ["Henkan", "Henkan"],
			242: ["Kana", "Kana"],
			13: [["Enter", "\n"], ["Enter", "\n"]],
			32: [["Space", " "], ["Space", " "]],
			8: ["Bksp", "Bksp"],
			37: ["Left", "Left"],
			38: ["Up", "Up"],
			39: ["Right", "Right"],
			40: ["Down", "Down"],
			45: ["Ins", "Ins"],
			46: ["Del", "Del"],
			36: ["Home", "Home"],
			35: ["End", "End"],
			33: ["PgDn", "PgDn"],
			34: ["PgUp", "PgUp"],
			145: ["ScLock", "ScLock"],
			19: ["Pause", "Pause"],
			144: ["NumLock", "NumLock"],
			96: ["0", "0"],
			97: ["1", "1"],
			98: ["2", "2"],
			99: ["3", "3"],
			100: ["4", "4"],
			101: ["5", "5"],
			102: ["6", "6"],
			103: ["7", "7"],
			104: ["8", "8"],
			105: ["9", "9"],
			106: ["*", "*"],
			107: ["+", "+"],
			109: ["-", "-"],
			110: [".", "."],
			111: ["/", "/"]
		};
		map.qweus = __extend(map.qwejp, {
			48: ["0", ")"],
			50: ["2", "@"],
			54: ["6", "^"],
			55: ["7", "&"],
			56: ["8", "*"],
			57: ["9", "("],
			189: ["-", "_"],
			222: ["+", "="],
			220: ["\\", "|"],
			192: ["[", "{"],
			219: ["]", "}"],
			187: [";", ":"],
			186: ["'", '"'],
			221: ["`", "~"],
			188: [",", "<"],
			190: [".", ">"],
			191: ["/", "?"],
			226: ["`", "~"]
		});
		map.dvo = __extend(map.qweus, {
			65: ["a", "A"],
			66: ["x", "X"],
			67: ["j", "J"],
			68: ["e", "E"],
			69: [".", ">"],
			70: ["u", "U"],
			71: ["i", "I"],
			72: ["d", "D"],
			73: ["c", "C"],
			74: ["h", "H"],
			75: ["t", "T"],
			76: ["n", "N"],
			77: ["m", "M"],
			78: ["b", "B"],
			79: ["r", "R"],
			80: ["l", "L"],
			81: ["'", '"'],
			82: ["p", "P"],
			83: ["o", "O"],
			84: ["y", "Y"],
			85: ["g", "G"],
			86: ["k", "K"],
			87: [",", "<"],
			88: ["q", "Q"],
			89: ["f", "F"],
			90: [";", ":"],
			189: ["[", "{"],
			222: ["]", "}"],
			220: ["\\", "|"],
			192: ["/", "?"],
			219: ["=", "+"],
			187: ["s", "S"],
			186: ["-", '_'],
			221: ["`", "~"],
			188: ["w", "W"],
			190: ["v", "V"],
			191: ["z", "Z"],
			226: ["`", "~"]
		});
		map.colemak = __extend(map.qweus, {
			68: ["s", "S"],
			69: ["f", "F"],
			70: ["t", "T"],
			71: ["d", "D"],
			73: ["u", "U"],
			74: ["n", "N"],
			75: ["e", "E"],
			76: ["i", "I"],
			78: ["k", "K"],
			79: ["y", "Y"],
			80: [";", ":"],
			82: ["p", "P"],
			83: ["r", "R"],
			84: ["g", "G"],
			85: ["l", "L"],
			89: ["j", "J"],
			187: ["o", "O"]
		});

		im = (function() {
			var im = {}, romaTable, asciiExp, fasciiExp, fasciiExp2, fasciiHash, kataExp, ascii, fascii, hiraBase, hiraDaku, hiraNoDaku, hiraHan, hiraNoHan, daku, handaku;
			romaTable = {
				'あ':['a'],
				'ぁ':['xa','la'],
				'い':['i','yi'],
				'いぇ':['ye'],
				'ぃ':['xi','li','xyi','lyi'],
				'う':['u','wu','whu'],
				'うぁ':['wha'],
				'うぃ':['wi','whi'],
				'うぇ':['we','whe'],
				'うぉ':['who'],
				'ぅ':['xu','lu'],
				'ゔ':['vu'],
				'ゔぁ':['va'],
				'ゔぃ':['vi','vyi'],
				'ゔぇ':['ve','vye'],
				'ゔぉ':['vo'],
				'ゔゃ':['vya'],
				'ゔゅ':['vyu'],
				'ゔょ':['vyo'],
				'え':['e'],
				'ぇ':['xe','le','lye','xye'],
				'お':['o'],
				'ぉ':['xo','lo'],
				'か':['ka','ca'],
				'が':['ga'],
				'き':['ki'],
				'きゃ':['kya'],
				'きぃ':['kyi'],
				'きゅ':['kyu'],
				'きぇ':['kye'],
				'きょ':['kyo'],
				'ぎ':['gi'],
				'ぎゃ':['gya'],
				'ぎぃ':['gyi'],
				'ぎゅ':['gyu'],
				'ぎぇ':['gye'],
				'ぎょ':['gyo'],
				'く':['ku','cu','qu'],
				'くぁ':['qa','qwa','kwa'],
				'くぃ':['qi','qwi','qyi'],
				'くぅ':['qwu'],
				'くぇ':['qe','qye','qwe'],
				'くぉ':['qo','qwo'],
				'くゃ':['qya'],
				'くゅ':['qyu'],
				'くょ':['qyo'],
				'ぐ':['gu'],
				'ぐぁ':['gwa'],
				'ぐぃ':['gwi'],
				'ぐぅ':['gwu'],
				'ぐぇ':['gwe'],
				'ぐぉ':['gwo'],
				'け':['ke'],
				'げ':['ge'],
				'こ':['ko','co'],
				'ご':['go'],
				'さ':['sa'],
				'ざ':['za'],
				'し':['si','ci','shi'],
				'しゃ':['sya','sha'],
				'しぃ':['syi'],
				'しゅ':['syu','shu'],
				'しぇ':['sye','she'],
				'しょ':['syo','sho'],
				'じ':['zi','ji'],
				'じゃ':['ja','jya','zya'],
				'じぃ':['jyi','zyi'],
				'じゅ':['ju','jyu','zyu'],
				'じぇ':['je','jye','zye'],
				'じょ':['jo','jyo','zyo'],
				'す':['su'],
				'すぁ':['swa'],
				'すぃ':['swi'],
				'すぅ':['swu'],
				'すぇ':['swe'],
				'すぉ':['swo'],
				'ず':['zu'],
				'せ':['se','ce'],
				'ぜ':['ze'],
				'そ':['so'],
				'ぞ':['zo'],
				'た':['ta'],
				'だ':['da'],
				'ち':['ti','chi'],
				'ちゃ':['tya','cha','cya'],
				'ちぃ':['tyi','cyi'],
				'ちゅ':['tyu','cyu','chu'],
				'ちぇ':['tye','che','cye'],
				'ちょ':['tyo','cyo','cho'],
				'ぢ':['di'],
				'ぢゃ':['dya'],
				'ぢぃ':['dyi'],
				'ぢゅ':['dyu'],
				'ぢぇ':['dye'],
				'ぢょ':['dyo'],
				'つ':['tu','tsu'],
				'つぁ':['tsa'],
				'つぃ':['tsi'],
				'つぇ':['tse'],
				'つぉ':['tso'],
				'づ':['du'],
				'て':['te'],
				'てぃ':['thi'],
				'てぇ':['the'],
				'てゃ':['tha'],
				'てゅ':['thu'],
				'てょ':['tho'],
				'で':['de'],
				'でぃ':['dhi'],
				'でぇ':['dhe'],
				'でゃ':['dha'],
				'でゅ':['dhu'],
				'でょ':['dho'],
				'と':['to'],
				'とぁ':['twa'],
				'とぃ':['twi'],
				'とぅ':['twu'],
				'とぇ':['twe'],
				'とぉ':['two'],
				'ど':['do'],
				'どぁ':['dwa'],
				'どぃ':['dwi'],
				'どぅ':['dwu'],
				'どぇ':['dwe'],
				'どぉ':['dwo'],
				'な':['na'],
				'に':['ni'],
				'にゃ':['nya'],
				'にぃ':['nyi'],
				'にゅ':['nyu'],
				'にぇ':['nye'],
				'にょ':['nyo'],
				'ぬ':['nu'],
				'ね':['ne'],
				'の':['no'],
				'は':['ha'],
				'ば':['ba'],
				'ぱ':['pa'],
				'ひ':['hi'],
				'ひゃ':['hya'],
				'ひぃ':['hyi'],
				'ひゅ':['hyu'],
				'ひぇ':['hye'],
				'ひょ':['hyo'],
				'び':['bi'],
				'びゃ':['bya'],
				'びぃ':['byi'],
				'びゅ':['byu'],
				'びぇ':['bye'],
				'びょ':['byo'],
				'ぴ':['pi'],
				'ぴゃ':['pya'],
				'ぴぃ':['pyi'],
				'ぴゅ':['pyu'],
				'ぴぇ':['pye'],
				'ぴょ':['pyo'],
				'ふ':['hu','fu'],
				'ふぁ':['fa','fwa'],
				'ふぃ':['fi','fwi','fyi'],
				'ふぅ':['fwu'],
				'ふぇ':['fe','fwe'],
				'ふぉ':['fo','fwo'],
				'ふゃ':['fya'],
				'ふゅ':['fyu'],
				'ふょ':['fyo'],
				'ぶ':['bu'],
				'ぷ':['pu'],
				'へ':['he'],
				'べ':['be'],
				'ぺ':['pe'],
				'ほ':['ho'],
				'ぼ':['bo'],
				'ぽ':['po'],
				'ま':['ma'],
				'み':['mi'],
				'みゃ':['mya'],
				'みぃ':['myi'],
				'みゅ':['myu'],
				'みぇ':['mye'],
				'みょ':['myo'],
				'む':['mu'],
				'め':['me'],
				'も':['mo'],
				'や':['ya'],
				'ゃ':['xya','lya'],
				'ゆ':['yu'],
				'ゅ':['xyu','lyu'],
				'よ':['yo'],
				'ょ':['xyo','lyo'],
				'ら':['ra'],
				'り':['ri'],
				'りゃ':['rya'],
				'りぃ':['ryi'],
				'りゅ':['ryu'],
				'りぇ':['rye'],
				'りょ':['ryo'],
				'る':['ru'],
				'れ':['re'],
				'ろ':['ro'],
				'わ':['wa'],
				'ゎ':['xwa','lwa'],
				'ゐ':['wyi'],
				'ゑ':['wye'],
				'を':['wo'],
				'ん':function(cont) {
					var ret = ['nn','xn', "n'"];
					var head, rest, inter, inters, dsum;

					for (var i = 0; i < cont.length; ++i) {
						head = cont[i].k[0];
						rest = cont[i].k.slice(1);
						if ("aiueony".indexOf(head) < 0) {
							if (rest.length) {
								inters = [
									{k: ['n', head], d: 1},
									{k: rest,        d: cont[i].d}
								];
								dsum = cont[i].d;
								inter = cont[i];
								while (dsum < cont[i].dsum) {
									// copy intermediate nodes
									inter = inter.n[0];
									inters.push(__clone(inter));
									dsum += inter.d;
								}
							} else {
								inters = {
									k: ['n', head],
									d: cont[i].d + 1
								};
							}
							ret.push(inters);
						}
					}

					return ret;
				},
				'っ':function(cont) {
					var ret = ['xtu','xtsu','ltu','ltsu'];
					var head, rest, inter, inters, dsum;

					for (var i = 0; i < cont.length; ++i) {
						head = cont[i].k[0];
						rest = cont[i].k.slice(1);
						if (head !== "n" && rest.length) {
							inters = [
								{k: [head, head], d: 1},
								{k: rest        , d: cont[i].d}
							];

							dsum = cont[i].d;
							inter = cont[i];
							while (dsum < cont[i].dsum) {
								// copy intermediate nodes
								inter = inter.n[0];
								inters.push(__clone(inter));
								dsum += inter.d;
							}
							ret.push(inters);
						}
					}

					return ret;
				},
				"ー":["-"],
				"。":["."],
				"、":[","],
				"・":["/"]
			};
			asciiExp = /[\x20-\x7e\n\t]/g;
			fasciiExp = /[\uFF01-\uFF5E]/g;
			fasciiExp2 = /[　￥”“]|(\r\n)/g;
			fasciiHash = {"　": " ", "￥": "\\", "”":"\"", "“":"\"", "\r\n":"\n"};
			kataExp = /[\u30A1-\u30F6]/g;
			ascii = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()-=^~\\|@`[{;+:*]},<.>/?_ \t\n";
			fascii = "ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ０１２３４５６７８９！＂＃＄％＆＇（）－＝＾～￥｜＠｀［｛；＋：＊］｝，＜．＞／？＿　\t\n";
			hiraBase = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんぁぃぅぇぉゃゅょっー。、・「」";
			hiraDaku = "がぎぐげござじずぜぞだぢづでどばびぶべぼゔ";
			hiraNoDaku = "かきくけこさしすせそたちつてとはひふへほう";
			hiraHan = "ぱぴぷぺぽ";
			hiraNoHan = "はひふへほ";
			daku = "゛";
			handaku = "゜";

			// fix full width ascii -> ascii
			function asciiFix(str) {
				return str.replace(fasciiExp, function(m) {
					return String.fromCharCode(m.charCodeAt() - 0xFEE0);
				}).replace(fasciiExp2, function(m) {
					return fasciiHash[m];
				});
			}

			// fix Katakana -> Hiragana
			function kataFix(str) {
				return str.replace(kataExp, function(m) {
					return String.fromCharCode(m.charCodeAt() - 0x0060);
				});
			}

			// scan table and modify
			function modTable(t, fn) {
				var mods = [];
				var i, j, k, row, keys, mod;

				for (i in t) {
					row = t[i];
					if (row instanceof Function) {
						continue;
					}

					for (j = 0; j < row.length; ++j) {
						keys = row[j];

						if (typeof keys === "object") {
							keys = keys.k.slice();
						} else {
							keys = keys.split("");
						}
						mod = fn(keys, i, j);
						if (mod !== void 0) {
							if (mod instanceof Array) {
								for (k = 0; k < mod.length; ++k) {
									mods.push(mod[k]);
								}
							} else {
								mods.push(mod);
							}
						}
					}
				}

				for (i = 0; i < mods.length; ++i) {
					mod = mods[i];
					switch (mod.m) {
						case "add":
							if (t[mod.i]) {
								t[mod.i] = t[mod.i].concat(mod.v);
							} else {
								t[mod.i] = [mod.v];
							}
							break;
						case "mod":
							t[mod.i] = __clone(t[mod.i]);
							t[mod.i][mod.j] = mod.v;
							break;
						case "rep":
							t[mod.i] = mod.v;
							break;
						default:
							throw new Error("failed to scan im table");
					}
				}

				return t;
			}

			im.ascii = function() {
				var acceptKeysyms = {};

				__each(ascii, function(e) {
					acceptKeysyms[e] = e;
				});

				return {
					symTable: acceptKeysyms,
					parser: function(src, strictParse) {
						var ret = [];
						src = asciiFix(src);
						src.replace(asciiExp, function(m) {
							ret.push([{
								k: [m],
								d: 1
							}]);
						});
						__each(ret, function(e, i) {
							if (i + 1 < ret.length) {
								e[0].n = ret[i + 1];
							}
						});
						if (ret.length !== src.length) {
							strictParse && alert("parse error");
						}
						return ret;
					}
				};
			};
			im.jis = function() {
				var t = {}, acceptKeysyms = {}, jmap;
				jmap = {
					48: ["わ", "を"],
					49: ["ぬ", "ぬ"],
					50: ["ふ", "ふ"],
					51: ["あ", "ぁ"],
					52: ["う", "ぅ"],
					53: ["え", "ぇ"],
					54: ["お", "ぉ"],
					55: ["や", "ゃ"],
					56: ["ゆ", "ゅ"],
					57: ["よ", "ょ"],
					65: ["ち", "ち"],
					66: ["こ", "こ"],
					67: ["そ", "そ"],
					68: ["し", "し"],
					69: ["い", "ぃ"],
					70: ["は", "は"],
					71: ["き", "き"],
					72: ["く", "く"],
					73: ["に", "に"],
					74: ["ま", "ま"],
					75: ["の", "の"],
					76: ["り", "り"],
					77: ["も", "も"],
					78: ["み", "み"],
					79: ["ら", "ら"],
					80: ["せ", "せ"],
					81: ["た", "た"],
					82: ["す", "す"],
					83: ["と", "と"],
					84: ["か", "か"],
					85: ["な", "な"],
					86: ["ひ", "ひ"],
					87: ["て", "て"],
					88: ["さ", "さ"],
					89: ["ん", "ん"],
					90: ["つ", "っ"],
					189: ["ほ", "ほ"],
					222: ["へ", "へ"],
					220: ["ー", "ー"],
					192: ["゛", "゛"],
					219: ["゜", "「"],
					187: ["れ", "れ"],
					186: ["け", "け"],
					221: ["む", "」"],
					188: ["ね", "、"],
					190: ["る", "。"],
					191: ["め", "・"],
					226: ["ろ", "ろ"]
				};

				// add basic rules
				__each(hiraBase, function(e) {
					t[e] = [e];
					acceptKeysyms[e] = e;
				});

				// add dakuon rules
				__each(hiraDaku, function(e, i) {
					t[e] = [hiraNoDaku.charAt(i) + daku];
				});
				acceptKeysyms[daku] = daku;

				// add handakuon rules
				__each(hiraHan, function(e, i) {
					t[e] = [hiraNoHan.charAt(i) + handaku];
				});
				acceptKeysyms[handaku] = handaku;

				// add ascii rules
				__each(ascii, function(e, i) {
					t[e] = [e];
					acceptKeysyms[e] = fascii.charAt(i);
				});

				// fix \ key problem
				if (__browser.opera) {
					jmap[220][0] = [jmap[220][0], "ろ"];
					jmap[220][1] = [jmap[220][1], "ろ"];
				}

				return {
					overload: jmap,
					symTable: acceptKeysyms,
					parser: function(src, strictParse) {
						src = asciiFix(src);
						src = kataFix(src);
						return __parse(src, t, 1, strictParse);
					}
				};
			};
			im.roma = function() {
				var t = __clone(romaTable), acceptKeysyms = {}, ruleMaxLength = 2;

				// add ascii rules
				__each(ascii, function(e) {
					t[e] = [e];
					acceptKeysyms[e] = e;
				});

				return {
					symTable: acceptKeysyms,
					parser: function(src, strictParse) {
						src = asciiFix(src);
						src = kataFix(src);
						return __parse(src, t, ruleMaxLength, strictParse);
					}
				};
			};
			im.dvojp = function() {
				var t = __clone(romaTable), acceptKeysyms = {}, ruleMaxLength = 3, extKeys, altYSelector, diph;

				extKeys = {
					"_c": ["_k", "_k"],
					"_h": ["_y1", "_y1"],
					"_n": ["_y2", "_y2"],
					"_'": ["_ai", "_ai"],
					"_,": ["_ou", "_ou"],
					"_.": ["_ei", "_ei"],
					"_;": ["_ann", "_ann"],
					"_q": ["_onn", "_onn"],
					"_j": ["_enn", "_enn"],
					"_k": ["_unn", "_unn"],
					"_x": ["_inn", "_inn"]
				};
				altYSelector = {p:1,f:2,g:2,_k:2,r:1,l:1,d:2,h:2,t:2,n:1,s:1,q:1,j:1,k:1,x:1,b:2,m:2,w:1,v:1,z:1};
				diph = {
					a: {
						h: "い",
						k: "i"
					},
					o: {
						h: "う",
						k: "u"
					},
					e: {
						h: "い",
						k: "i"
					}
				};

				// add alternative 'k' rules
				modTable(t, function(keys, i, j) {
					for (j = 0; j < keys.length; ++j) {
						if (keys[j] === "k") {
							keys[j] = "_k";
							return {
								m: "add",
								v: {k: keys},
								i: i
							};
						}
					}
				});

				// add alternative 'y' rules
				modTable(t, function(keys, str, j) {
					if (keys.length === 3 && keys[1] === "y" && str.length === 2 && "ゃぃゅぇょ".indexOf(str.charAt(1)) >= 0) {
						keys[1] = altYSelector[keys[0]];
						if (keys !== void 0) {
							keys[1] = "_y" + keys[1];
							return {
								m: "add",
								v: {k: keys},
								i: str
							};
						}
					}
				});

				// add diphthong rules ('ai', 'ou', 'ei')
				modTable(t, function(keys, str, j) {
					var ret, last, tail, d;
					last = keys.length - 1;
					tail = keys[last];
					d = diph[tail];

					if (last > 0) {
						keys[last] = "_" + tail + "nn";
						ret = {
							m: "add",
							i: str + "ん",
							v: {k: keys}
						};

						if (d) {
							keys = keys.slice();
							keys[last] = "_" + tail + d.k;
							ret = [ret, {
								m: "add",
								i: str + d.h,
								v: {k: keys}
							}];
						}
					}

					return ret;
				});

				// add ascii rules
				__each(ascii, function(e) {
					t[e] = [e];
					acceptKeysyms[e] = e;
				});

				// add exteded keys
				acceptKeysyms._k = "k";	// or "c"
				acceptKeysyms._y1 = "y";	// or "h"
				acceptKeysyms._y2 = "y";	// or "n"
				acceptKeysyms._ai = "ai";	// or "'"
				acceptKeysyms._ou = "ou";	// or ","
				acceptKeysyms._ei = "ei";	// or "."
				acceptKeysyms._ann = "ann";	// or ";"
				acceptKeysyms._onn = "onn";	// or "q"
				acceptKeysyms._enn = "enn";	// or "j"
				acceptKeysyms._unn = "unn";	// or "k"
				acceptKeysyms._inn = "inn";	// or "x"

				return {
					overload: extKeys,
					symTable: acceptKeysyms,
					parser: function(src, strictParse) {
						src = asciiFix(src);
						src = kataFix(src);
						return __parse(src, t, ruleMaxLength, strictParse);
					}
				};
			};

			return im;
		})();

		return {
			kbd: kbd,
			map: map,
			im: im
		};
	})();

	// create a new class
	function __class(src) {
		var klass = function() {
			this.init.apply(this, arguments);
		};
		klass.prototype = src;
		return klass;
	}

	// make a prototype copy
	function __clone(src) {
		var clone = function(){};
		clone.prototype = src;
		return new clone();
	}

	// make a prototype copy and extend it
	function __extend(src, ext) {
		var i, ret = __clone(src);

		for (i in ext) {
			ret[i] = ext[i];
		}

		return ret;
	}

	// like Array.forEach
	function __each(a, fn) {
		var i;
		if (a instanceof Function) {
			return;
		} else if (typeof a === "string") {
			for (i = 0; i < a.length; ++i) {
				if (fn(a.charAt(i), i)) {
					break;	// avoid [] indexer for legacy browsers
				}
			}
		} else if (a instanceof Array) {
			for (i = 0; i < a.length; ++i) {
				if (fn(a[i], i)) {
					break;
				}
			}
		} else {
			for (i in a) {
				if (fn(a[i], i)) {
					break;
				}
			}
		}

		return a;
	}

	// like Array.filter
	function __filter(a, fn) {
		var ret = [], i;
		if (typeof a === "string") {
			for (i = 0; i < a.length; ++i) {
				// avoid [] indexer for legacy browsers
				if (fn(a.charAt(i), i)) {
					ret.push(a.charAt(i));
				}
			}
		} else {
			for (i = 0; i < a.length; ++i) {
				if (fn(a[i], i)) {
					ret.push(a[i]);
				}
			}
		}
		return ret;
	}

	// like Array.map
	function __map(a, fn) {
		var ret = [], i;
		if (typeof a === "string") {
			for (i = 0; i < a.length; ++i) {
				ret.push(fn(a.charAt(i), i));	// avoid [] indexer for legacy browsers
			}
		} else {
			for (i = 0; i < a.length; ++i) {
				ret.push(fn(a[i], i));
			}
		}
		return ret;
	}

	function __uniq(a) {
		var ret = [], s = {}, i;
		for (i = 0; i < a.length; ++i) {
			if (!s[a[i]] && a[i] !== void 0) ret.push(a[i]);
			s[a[i]] = true;
		}
		return ret;
	}

	function __find(a, v) {
		var ret = false;

		__each(a, function(e, i) {
			if (typeof e === "object") {
				if (__find(e, v) !== false) {
					ret = i;
					return true;
				}
			} else {
				if (e === v) {
					ret = i;
					return true;
				}
			}
		});

		return ret;
	}

	function __addRule(r, i, j, rules, reach, ret) {
		var nextPos, dsum, head, tail;

		if (typeof r === "string") {
			nextPos = i + j;

			head = tail = {
				k: r.split(""),
				d: j,
				n: ret[nextPos]
			};
		} else if (r.length) {
			// link intermediate nodes
			dsum = 0;
			r = r.slice();
			for (var l = r.length - 1; l >= 0; l--) {
				r[l] = __clone(r[l]);
				r[l].n = [r[l + 1]];
				dsum += r[l].d;
			}
			nextPos = i + dsum;
			r[r.length - 1].n = ret[nextPos];
			r[0].dsum = dsum;
			head = r[0];
			tail = r[r.length - 1];
		} else {
			r = __clone(r);
			if (r.d === void 0) r.d = j;
			nextPos = i + r.d;
			r.n = ret[nextPos];
			head = tail = r;
		}

		rules.push(head);
		if (!reach[nextPos]) {
			reach[nextPos] = [];
		}
		reach[nextPos].push(tail);
	}

	// default parser used from __embed.im.*
	function __parse(src, table, ruleMaxLength, strictParse) {
		var ret = [], reach = [], rules, rule, i, j, l, len;

		// scan backward
		len = src.length;
		for (i = len - 1; i >= 0; i--) {
			rules = [];
			for (j = 1; j <= ruleMaxLength && i + j <= len; ++j) {
				rule = table[src.slice(i, i + j)];
				if (rule === void 0) {
					continue;
				} else if (rule instanceof Function) {
					rule = rule(ret[i + j] || []);
				}

				for (l = 0; l < rule.length; ++l) {
					__addRule(rule[l], i, j, rules, reach, ret);
				}
			}
			ret[i] = rules;
		}

		// check if any dead-end
		for (i = 0; i < reach.length - 1; ++i) {
			// if dead-end exists
			if (reach[i] && (!ret[i] || !ret[i].length)) {
				if (strictParse) {
					throw new Error("parse error");
				} else {
					// pass through it
					for (j = 0; j < reach[i].length; ++j) {
						++reach[i][j].d;
						reach[i][j].n = ret[i + 1];
						if (!reach[i + 1]) {
							reach[i + 1] = [];
						}
					}
					reach[i + 1] = reach[i + 1].concat(reach[i]);
					reach[i] = null;
				}
			}
		}

		return ret;
	}

	Tsuikyo = __class({
		// public:
		init: function(args) {
			args = args || {};

			// opts is a prototype child of __defaultOpts
			this._opts = __clone(__defaultOpts);

			// apply specified arguments
			for (var k in args) {
				switch (k) {
					case "kbd":
					case "map":
					case "im":
					case "eventRoot":
					case "prevent":
					case "strictParse":
					case "flex":
						this._opts[k] = args[k];
						break;
					default:
						throw new Error("unknown argument '" + k + "'");
				}
			}

			// apply input settings
			this._getEmbed(["kbd", "map", "im"]);
			this._overloadMap();
			this._makeWrapper();

			this.listen();
		},

		map: function(map) {
			if (!map) {
				return this._opts.map;
			} else {
				this._opts.map = map;
				this._getEmbed(["map"]);
				this._overloadMap();
			}
		},

		listen: function(callback) {
			if (callback !== void 0) {
				this._callback = callback;
			}

			if (this._state !== Tsuikyo.STATE_LISTEN) {
				// start handling key events
				this._wrapKeyEvents();
				this._state = Tsuikyo.STATE_LISTEN;
			}

			return this;
		},

		sleep: function() {
			if (this._state !== Tsuikyo.STATE_SLEEP) {
				// stop handling key events
				this._unwrapKeyEvents();
				this._state = Tsuikyo.STATE_SLEEP;
			}

			return this;
		},

		make: function(src, tag, flex) {
			flex = flex || this._opts.flex;
			return new Word(this, src, tag, flex);
		},

		stroke: function(e, test) {
			if (typeof e === "string" || e === void 0) {
				e = this._makeEventObj(e);
			} else if (e.key === void 0) {
				e = this._makeEventObj("", e);
			}
			e.test = !!test;

			if (this._callback instanceof Function) {
				// main callback
				if (this._callback(e) === false) {
					// prevented
					return false;
				}
			}

			if (e.sendable) {
				// send the keystroke to all listening word
				for (var i = 0; i < this._listen.length; ++i) {
					this._listen[i].stroke(e, test);
				}
			}
			return true;
		},
		test: function(e) {
			this.stroke(e, true);
		},

		words: function() {
			return this._listen.slice();
		},

		// private:
		_state: 0,
		_opts: null,
		_kbd: null,
		_map: null,
		_im: null,
		_listen: [],
		_wrapper: null,
		_callback: null,

		_makeEventObj: function(key, env) {
			var e = {};
			var keysyms;
			var keyCheck = this._im.symTable;

			e.type = "keystroke";

			if (env) {
				e.target = env.target;
				e.mod = env.shift;
				keysyms = this._map[env.keyCode][e.mod ? 1 : 0];
				if (keysyms instanceof Array) {
					e.key = keysyms[0];
					e.allSyms = keysyms;
				} else {
					e.key = keysyms;
					e.allSyms = [keysyms];
				}
				e.keyCode = env.keyCode;
				e.nativeCode = env.nativeCode;
			} else {
				e.key = key;
				e.allSyms = [key];
			}

			// chk if the key is sendable
			for (var i = 0; i < e.allSyms.length; ++i) {
				if (keyCheck[e.allSyms[i]] !== void 0) {
					e.sendable = true;
					e.keyChar = keyCheck[e.allSyms[i]];
					break;
				}
			}

			return e;
		},
		_makeWrapper: function() {
			var that = this, keyFilter, env, fire, wrapper;
			keyFilter = this._kbd;
			env = {
				prevent: this._opts.prevent,
				report: this._opts.report,
				type: "",			// event type (keydown / keypress / keyup)
				target: null,		// event src element
				keyState: {},		// flag to block key repeat
				identified: false,	// flag to cancel keypress trigger
				nativeCode: 0,		// native keyCode of the browser
				keyCode: 0,			// converted keyCode
				shift: false
			};
			fire = function() {
				var e;
				env.shift = !!env.keyState[16];
				e = that._makeEventObj("", env);
				return that.stroke(e);
			};
			wrapper = function(event) {
				var e, c, cc;
				e = event || window.event;
				c = e.keyCode || e.which || e.charCode;

				env.type = e.type;
				env.target = e.target || e.srcElement;
				env.shift = !!env.keyState[16];

				switch (e.type) {
					case "keydown":
						env.nativeCode = c;
						c = env.keyCode = keyFilter(c, env);
						if (c >= 0) {
							// the key has been identified
							if (!env.keyState[c]) {
								env.keyState[c] = true;
								e.returnValue = fire();
								env.identified = true;		// cancel keypress process
							} else {
								// block key repeat
							}
						} else {
							// need to check keypress event to identify the key
							env.identified = false;
						}
						break;
					case "keypress":
						if (!env.identified) {
							c = env.keyCode = keyFilter(c, env);
							if (!env.keyState[c]) {
								env.keyState[c] = env.nativeCode + 1;
								e.returnValue = fire();
							} else {
								// block key repeat
							}
						} else {
							// the key has already been identified in keydown event
						}
						break;
					case "keyup":
						env.nativeCode = c;
						c = keyFilter(c, env);
						if (c >= 0) {
							if (env.keyState[c]) {
								env.keyState[c] = false;
							} else {
								if (c !== 244 && env.report) {
									throw new Error("keyup from unpressed key");
								}
							}
						} else {
							// find the pressing key and reset it
							for (cc in env.keyState) {
								if (env.keyState[cc] === env.nativeCode + 1) {
									env.keyState[cc] = false;
									break;
								}
							}
						}
						break;
					default:
						if (env.report) {
							throw new Error("key-event wrapper caught an unexpected event.");
						}
						break;
				}

				// cancel default action
				if (env.prevent || e.returnValue === false) {
					if (! (c < 0 && (__browser.ie || __browser.chrome || __browser.safari))) {
						if (e.preventDefault instanceof Function) {
							e.preventDefault();
						}
						e.returnValue = false;
						try {
							e.keyCode = 0;	// cancel function-keys in IE
						} catch (err) {
							// ignore
						}
					} else {
						// Since preventDefault() suppress its keypress event on IE and Webkit,
						// we should not prevent keydown when the charCode, which can only be got in keypress, is required to identify the key
					}
				}

				return e.returnValue;
			};

			this._wrapper = wrapper;
			return wrapper;
		},
		_wrapKeyEvents: function() {
			var root = this._opts.eventRoot || {}, wrap = this._wrapper;

			if (root.addEventListener) {
				// DOM Level 2
				root.addEventListener("keydown", wrap, false);
				root.addEventListener("keypress", wrap, false);
				root.addEventListener("keyup", wrap, false);
			} else if (root.attachEvent) {
				// IE
				root.attachEvent("onkeydown", wrap);
				root.attachEvent("onkeypress", wrap);
				root.attachEvent("onkeyup", wrap);
			} else if (root.onkeydown) {
				// DOM Level 0 (trad)
				root.onkeydown = wrap;
				root.onkeypress = wrap;
				root.onkeyup = wrap;
			} else {
				if (this._opts.report) {
					throw new Error("failed to add events.");
				}
			}
		},
		_unwrapKeyEvents: function() {
			var root = this._opts.eventRoot || {}, wrap = this._wrapper;

			if (root.removeEventListener) {
				// DOM Level 2
				root.removeEventListener("keydown", wrap, false);
				root.removeEventListener("keypress", wrap, false);
				root.removeEventListener("keyup", wrap, false);
			} else if (root.detachEvent) {
				// IE
				root.detachEvent("onkeydown", wrap);
				root.detachEvent("onkeypress", wrap);
				root.detachEvent("onkeyup", wrap);
			} else if (root.onkeydown) {
				// DOM Level 0 (trad)
				root.onkeydown = void 0;
				root.onkeypress = void 0;
				root.onkeyup = void 0;
			} else {
				if (this._opts.report) {
					throw new Error("failed to remove events.");
				}
			}
		},
		_parse: function(src) {
			return (this._im.parser instanceof Function) && this._im.parser(src);
		},
		_addListenWord: function(word) {
			for (var i = 0; i < this._listen.length; ++i) {
				if (this._listen[i] === word) {
					// already registered
					return false;
				}
			}
			this._listen.push(word);
			return true;
		},
		_removeListenWord: function(word) {
			for (var i = 0; i < this._listen.length; ++i) {
				if (this._listen[i] === word) {
					this._listen.splice(i, 1);
					return true;
				}
			}
			return false;
		},
		_getEmbed: function(keys) {
			var i, k, data;
			for (i = 0; i < keys.length; ++i) {
				k = keys[i];
				data = __embed[k][this._opts[k]];
				if (data !== void 0) {
					if (k === "im" && data instanceof Function) {
						// extract data by using lazy evaluation
						__embed[k][this._opts[k]] = data();
					}

					// embedded setting
					this["_" + k] = __embed[k][this._opts[k]];
				} else if (typeof this._opts[k] !== "string") {
					// user defined setting
				} else {
					if (this._opts.report) throw new Error("unknown " + k + " '" + this._opts[k] + "'");
				}
			}
		},
		_overloadMap: function() {
			var map, mix, a, k, i, j;
			map = __clone(this._map);
			mix = this._im.overload;

			if (!mix) {
				return;
			}

			for (i in mix) {
				if (i.charAt(0) === "_") {
					k = __find(map, i.slice(1));
					if (k === false) continue;
				} else {
					k = i;
				}
				if (!map[k]) {
					map[k] = mix[i];
				} else if (map[k] instanceof Array && map[k].length === mix[i].length) {
					a = [];
					for (j = 0; j < map[k].length; ++j) {
						a.push(Array.prototype.concat(map[k][j], mix[i][j]));
					}
					map[k] = a;
				} else {
					if (this._opts.report) {
						throw new Error("fail to mix keymap");
					}
				}
			}

			this._map = map;
		}
	});

	Word = __class({
		// public:
		tag: null,

		init: function(tsuikyo, src, tag, flex) {
			if (tsuikyo) {
				this._ts = tsuikyo;
				this._src = src;
				this.tag = tag;
				this._flex = flex;
				this._nodeSrc = tsuikyo._parse(src, tsuikyo._opts.strictParse);
				this._chkJunctionCache = [];
				this._state = Tsuikyo.STATE_SLEEP;
			}
			this._nodes = this._linkNode(new Node(this._nodeSrc[0]));	// entry point
			this._activeNode = this._selectNode();
			this._input = [];
			if (flex === "fixed") {
				this._nodes = [this._activeNode];
			}

			return this;
		},
		listen: function(callback) {
			if (callback !== void 0) {
				this._callback = callback;
			}
			if (this._state === Tsuikyo.STATE_SLEEP) {
				this._state = Tsuikyo.STATE_LISTEN;
				this._ts._addListenWord(this);
			}

			return this;
		},
		sleep: function() {
			this._state = Tsuikyo.STATE_SLEEP;
			this._ts._removeListenWord(this);

			return this;
		},
		stroke: function(e, test) {
			var ret, ee;
			if (typeof e === "string" || e === void 0) {
				e = this._ts._makeEventObj(e);
			} else if (e.key === void 0) {
				e = this._ts._makeEventObj("", e);
			}

			ret = this._accept(e, test);
			ee = __extend(e, {
				ret: ret,
				test: !!test,
				type: "keystroked",
				accept: ret > Tsuikyo.TYPE_MISS,
				miss: ret === Tsuikyo.TYPE_MISS,
				finish: ret >= Tsuikyo.TYPE_FINISH
			});

			if (this._state === Tsuikyo.STATE_LISTEN && this._callback instanceof Function) {
				this._callback(ee);
			}
			return ee;
		},
		test: function(e) {
			return this.stroke(e, true);
		},

		totalCount: function() {
			return this._input.length;
		},
		acceptCount: function() {
			return this._activeNode.keys().length;
		},
		missCount: function(includeCancel) {
			if (includeCancel) {
				return this.totalCount() - this.acceptCount();
			} else {
				return this._missCount;
			}
		},
		cancelCount: function() {
			return this.totalCount() - this.acceptCount() - this._missCount;
		},
		pos: function() {
			return this._activeNode.pos;
		},
		kpos: function() {
			return this._activeNode.keys().length;
		},
		str: function(p) {
			if (p === void 0) {
				p = this._src.length;
			}
			if (p >= 0) {
				return this._src.slice(0, p);
			} else {
				return this._src.slice(-p - 1);
			}
		},
		rstr: function(p) {
			return this.str(-p - 1);
		},
		kstr: function(p) {
			var conv = this._ts._im.symTable, kpos = this.kpos(), keysyms;

			if (p === void 0) {
				keysyms = this._selectNodeToEnd().keys();
			} else if (p >= 0) {
				if (p <= kpos) {
					keysyms = this._activeNode.keys().slice(0, p);
				} else {
					keysyms = this._selectNodeToEnd().keys().slice(0, p);
				}
			} else {
				keysyms = this._selectNodeToEnd().keys().slice(-p - 1);
			}
			return __map(keysyms, function(e) {
				return conv[e];
			}).join("");
		},
		rkstr: function(p) {
			return this.kstr(-p - 1);
		},
		nextKeys: function() {
			var head = this._activeNode.next(), next;
			next = __map(this._nodes, function(node) {
				return node.next();
			});
			next.unshift(head);

			return __uniq(next);
		},
		keysyms: function() {
			return this._selectNodeToEnd().keys();
		},
		finished: function() {
			return this.pos() === this._src.length;
		},

		// private:
		_state: Tsuikyo.STATE_PREINIT,
		_ts: null,
		_flex: "",
		_callback: null,

		_src: "",
		_nodeSrc: [],
		_nodes: [],
		_activeNode: null,
		_input: [],
		_missCount: 0,
		_cancelCount: 0,

		_accept: function(e, test) {
			var ret = [], retMax, i;

			for (i = 0; i < this._nodes.length; ++i) {
				ret.push(this._nodes[i].accept(e, test));
			}

			retMax = Math.max.apply(null, ret);

			if (!test && retMax !== Tsuikyo.TYPE_IGNORE) {
				// refresh the word state
				this._refresh(retMax);
				this._input.push(e);
			}

			return retMax;
		},
		_refresh: function(type) {
			var ns, newNodes, linkedNodes, i;

			++this.inputCount;

			if (type !== Tsuikyo.TYPE_MISS) {
				// get all appropriate nodes
				ns = __filter(this._nodes, function(node, i) {
					return node.ret === type;
				});
			}

			switch (type) {
				case Tsuikyo.TYPE_MISS:	// no transition
					++this._missCount;
					break;
				case Tsuikyo.TYPE_INNER:	// internal transit
					if (this._flex === "flex") {
						this._nodes = ns;
					}
					this._activeNode = this._selectNode(ns);
					break;
				case Tsuikyo.TYPE_TRANSIT:	// node transit
					if (this._flex === "flex") {
						this._nodes = ns.slice();	// hard copy
						newNodes = [];
					} else {
						// include TYPE_INNER nodes as candidates to be active
						newNodes = __filter(this._nodes, function(node, i) {
							return node.ret === Tsuikyo.TYPE_INNER;
						});
					}

					for (i = 0; i < ns.length; ++i) {
						linkedNodes = this._linkNode(ns[i]);
						this._nodes = this._nodes.concat(linkedNodes);
						newNodes = newNodes.concat(linkedNodes);
						this._hideNode(ns[i]);
					}
					this._activeNode = this._selectNode(newNodes);
					break;
				case Tsuikyo.TYPE_JUNCTION:	// node transit and reach junction
				case Tsuikyo.TYPE_FINISH:	// node transit and reach the end point
					this._nodes = this._linkNode(this._selectNode(ns));
					this._activeNode = this._selectNode();
					break;
				case Tsuikyo.TYPE_FINISHED:	// already reached the end point
					this._input.pop();
					break;
				default:
					if (this._ts._opts.report) {
						throw new Error("Word._refresh: unknown refresh type " + type);
					}
					break;
			}

			if (this._flex === "fixed" && this._nodes.length > 1) {
				// when fixed mode, remains active node only
				this._nodes = [this._activeNode];
			}
		},
		_linkNode: function(parent) {
			var tailPos = this._src.length, next, isJunction, node, ret = [], i;

			if (!parent.n) {
				parent.n =  [new Node(null, parent)];
			}
			next = parent.n;

			for (i = 0; i < next.length; ++i) {
				isJunction = this._chkJunction(parent.pos + parent.d + next[i].d);
				node = new Node(next[i], parent, isJunction, tailPos);
				ret.push(node);
			}

			return ret;
		},
		_hideNode: function(node) {
			for (var i = 0; i < this._nodes.length; ++i) {
				if (this._nodes[i] === node) {
					this._nodes.splice(i, 1);
					break;
				}
			}
		},
		_selectNode: function(ns) {
			var sel, filters;
			sel = function(nodes, f) {
				var i, j, v, a = [], max = -Infinity;

				for (i = 0; i < nodes.length; ++i) {
					v = f(nodes[i]);
					if (v > max) {
						max = v;
						j = a.length;
					}
					if (v === max) {
						a.push(nodes[i]);
					}
				}

				return a.slice(j);
			};
			filters = [
				function(node) { return node.pos; },
				function(node) { return node.pos + node.d; },
				function(node) { return node.pos + (node.dsum || node.d); },
				function(node) { return node.i; },
				function(node) { return -node.k.length; }
			];
			ns = ns || this._nodes;

			if (ns.length > 1) {
				__each(filters, function(f) {
					ns = sel(ns, f);
					return ns.length === 1;	// true means break the loop
				});
			}

			return ns[0];
		},
		_selectNodeToEnd: function(start) {
			var node = start || this._activeNode;

			while(node.n && node.n.length) {
				node = this._selectNode(this._linkNode(node));
			}

			node = new Node(null, node, true, this._src.length);
			node.parent.n = [node];
			return node;
		},
		_chkJunctionCache: null,
		_chkJunction: function(pos) {
			var nodeSrc, d, i, j;
			if (this._chkJunctionCache[pos] !== void 0) {
				return this._chkJunctionCache[pos];
			}
			nodeSrc = this._nodeSrc;

			for (i = 0; i < pos; ++i) {
				for (j = 0; j < nodeSrc[i].length; ++j) {
					d = nodeSrc[i][j].dsum || nodeSrc[i][j].d;
					if (pos < i + d) {
						return this._chkJunctionCache[pos] = false;
					}
				}
			}

			return this._chkJunctionCache[pos] = true;
		}
	});

	Node = __class({
		k: [],
		i: 0,
		d: 0,
		dsum: 0,
		n: [],
		parent: null,
		isJunction: true,
		tailPos: -1,
		ret: -1,

		init: function(nodeSrc, parent, isJunction, tailPos) {
			if (!nodeSrc) {
				this.ret = 5;	// end point
			} else if (nodeSrc instanceof Array) {
				this.n = nodeSrc; // entry point
			} else {
				this.k = nodeSrc.k;
				this.d = nodeSrc.d;
				this.dsum = nodeSrc.dsum || this.d;
				this.n = nodeSrc.n;
			}
			this.parent = parent;
			this.isJunction = isJunction;
			this.tailPos = tailPos;
			this.pos = this._pos();
		},
		accept: function(e, test) {
			var keyMatch, nextSym = this.k[this.i], i;

			if (typeof e === "object" && e.allSyms) {
				for (i = e.allSyms.length - 1; i >= 0; i--) {
					if (e.allSyms[i] === nextSym) {
						keyMatch = true;
						break;
					}
				}

				if (keyMatch) {
					if (this.k.length === ++this.i) {
						if (this.isJunction) {
							if (this.tailPos === this.pos + this.d) {
								this.ret = Tsuikyo.TYPE_FINISH;
							} else {
								this.ret = Tsuikyo.TYPE_JUNCTION;
							}
						} else {
							this.ret = Tsuikyo.TYPE_TRANSIT;
						}
					} else {
						this.ret = Tsuikyo.TYPE_INNER;
					}
					test && --this.i;
				} else if (!this.k.length) {
					// end point always returns TYPE_FINISHED
					this.ret = Tsuikyo.TYPE_FINISHED;
				} else {
					this.ret = Tsuikyo.TYPE_MISS;
				}
			} else {
				this.ret = Tsuikyo.TYPE_IGNORE;
			}

			return this.ret;
		},
		_pos: function() {
			if (this.parent && this.parent.pos !== void 0) {
				return this.parent.pos + this.parent.d;
			} else {
				return 0;
			}
		},
		keys: function() {
			var keys, n = this.parent;
			keys = [this.k.slice(0, this.i)];

			while (n) {
				keys.push(n.k);
				n = n.parent;
			}

			return Array.prototype.concat.apply([], keys.reverse());
		},
		next: function() {
			return this.k[this.i];
		}
	});

	// enum
	__each([
		"TYPE_IGNORE",
		"TYPE_MISS",
		"TYPE_INNER",
		"TYPE_TRANSIT",
		"TYPE_JUNCTION",
		"TYPE_FINISH",
		"TYPE_FINISHED",

		"STATE_PREINIT",
		"STATE_SLEEP",
		"STATE_LISTEN"
	], function(e, i) {
		Tsuikyo[e] = Tsuikyo.prototype[e] = Word.prototype[e] = i - 1;
	});

	// export main class
	window[exportName] = Tsuikyo;
})("Tsuikyo");
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.VXETablePluginShortcutKey = exports.handleFuncs = exports.SKey = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils/methods/xe-utils"));

var _handleFuncs;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// import VXETable from 'vxe-table'
var arrowKeys = 'right,up,left,down'.split(',');
var specialKeys = 'alt,ctrl,shift,meta'.split(',');
var settingMaps = {};
var listenerMaps = {};
var disabledMaps = {};

var SKey =
/*#__PURE__*/
function () {
  function SKey(realKey, specialKey, funcName, kConf) {
    _classCallCheck(this, SKey);

    this.realKey = realKey;
    this.specialKey = specialKey;
    this.funcName = funcName;
    this.kConf = kConf;
  }

  _createClass(SKey, [{
    key: "trigger"
    /* TRIGGER */
    ,
    value: function trigger(params, evnt) {
      if (!this.specialKey || evnt["".concat(this.specialKey, "Key")]) {
        return handleFuncs[this.funcName](params, evnt);
      }
    }
  }, {
    key: "emit"
    /* EMIT */
    ,
    value: function emit(params, evnt) {
      if (!this.specialKey || evnt["".concat(this.specialKey, "Key")]) {
        return this.kConf.callback(params, evnt);
      }
    }
  }]);

  return SKey;
}();

exports.SKey = SKey;

function getEventKey(key) {
  if (arrowKeys.indexOf(key.toLowerCase()) > -1) {
    return "Arrow".concat(key);
  }

  return key;
}

function isTriggerPage(params) {
  var $table = params.$table;
  return !$table.getActiveRow();
}

function handleChangePage(func) {
  return function (params, evnt) {
    var $table = params.$table;
    var _$table$mouseConfig = $table.mouseConfig,
        mouseConfig = _$table$mouseConfig === void 0 ? {} : _$table$mouseConfig;
    var $grid = $table.$grid;

    if ($grid && mouseConfig.selected !== true && ['input', 'textarea'].indexOf(evnt.target.tagName.toLowerCase()) === -1 && isTriggerPage(params)) {
      var pager = $grid.$refs.pager;

      if (pager) {
        evnt.preventDefault();
        pager[func](evnt);
      }
    }
  };
}

function handleTabMove(isLeft) {
  return function (params, evnt) {
    var $table = params.$table;
    var actived = $table.getActiveRow();
    var selected = $table.getMouseSelecteds();

    if (selected) {
      $table.moveTabSelected(selected, isLeft, evnt);
    } else if (actived) {
      $table.moveTabSelected(actived, isLeft, evnt);
    }

    return false;
  };
}

function handleArrowMove(arrowIndex) {
  return function (params, evnt) {
    var $table = params.$table;
    var selected = $table.getMouseSelecteds();
    var arrows = [0, 0, 0, 0];
    arrows[arrowIndex] = 1;

    if (selected) {
      $table.moveSelected(selected, arrows[0], arrows[1], arrows[2], arrows[3], evnt);
      return false;
    }
  };
}
/**
 * 快捷键处理方法
 */


var handleFuncs = (_handleFuncs = {}, _defineProperty(_handleFuncs, "table.edit.actived"
/* TABLE_EDIT_ACTIVED */
, function tableEditActived(params, evnt) {
  var $table = params.$table;
  var selected = $table.getMouseSelecteds();

  if (selected) {
    evnt.preventDefault();
    $table.setActiveCell(selected.row, selected.column.property);
    return false;
  }
}), _defineProperty(_handleFuncs, "table.edit.closed"
/* TABLE_EDIT_CLOSED */
, function tableEditClosed(params, evnt) {
  var $table = params.$table;
  var _$table$mouseConfig2 = $table.mouseConfig,
      mouseConfig = _$table$mouseConfig2 === void 0 ? {} : _$table$mouseConfig2;
  var actived = $table.getActiveRow();

  if (actived) {
    evnt.preventDefault();
    $table.clearActived(evnt);

    if (mouseConfig.selected) {
      $table.$nextTick(function () {
        return $table.setSelectCell(actived.row, actived.column.property);
      });
    }

    return false;
  }
}), _defineProperty(_handleFuncs, "table.edit.rightTabMove"
/* TABLE_EDIT_RIGHTTABMOVE */
, handleTabMove(false)), _defineProperty(_handleFuncs, "table.edit.leftTabMove"
/* TABLE_EDIT_LEFTTABMOVE */
, handleTabMove(true)), _defineProperty(_handleFuncs, "table.cell.leftMove"
/* TABLE_CELL_LEFTMOVE */
, handleArrowMove(0)), _defineProperty(_handleFuncs, "table.cell.upMove"
/* TABLE_CELL_UPMOVE */
, handleArrowMove(1)), _defineProperty(_handleFuncs, "table.cell.rightMove"
/* TABLE_CELL_RIGHTMOVE */
, handleArrowMove(2)), _defineProperty(_handleFuncs, "table.cell.downMove"
/* TABLE_CELL_DOWNMOVE */
, handleArrowMove(3)), _defineProperty(_handleFuncs, "pager.prevPage"
/* PAGER_PREVPAGE */
, handleChangePage('prevPage')), _defineProperty(_handleFuncs, "pager.nextPage"
/* PAGER_NEXTPAGE */
, handleChangePage('nextPage')), _defineProperty(_handleFuncs, "pager.prevJump"
/* PAGER_PREVJUMP */
, handleChangePage('prevJump')), _defineProperty(_handleFuncs, "pager.nextJump"
/* PAGER_NEXTJUMP */
, handleChangePage('nextJump')), _handleFuncs);
exports.handleFuncs = handleFuncs;

function runEvent(key, maps, prop, params, evnt) {
  var skeyList = maps[key.toLowerCase()];

  if (skeyList) {
    return skeyList.some(function (skey) {
      return skey[prop](params, evnt) === false;
    });
  }
}

function handleShortcutKeyEvent(params, evnt) {
  var key = getEventKey(evnt.key);

  if (!runEvent(key, disabledMaps, "emit"
  /* EMIT */
  , params, evnt)) {
    runEvent(key, settingMaps, "trigger"
    /* TRIGGER */
    , params, evnt);
    runEvent(key, listenerMaps, "emit"
    /* EMIT */
    , params, evnt);
  }
}

function parseKeys(key) {
  var specialKey;
  var realKey;
  var keys = key.split('+');
  keys.forEach(function (item) {
    item = item.toLowerCase().trim();

    if (specialKeys.indexOf(item) > -1) {
      specialKey = item;
    } else {
      realKey = item;
    }
  });

  if (!realKey || keys.length > 2 || keys.length === 2 && !specialKey) {
    throw new Error("[vxe-table-plugin-shortcut-key] Invalid shortcut key configuration '".concat(key, "'."));
  }

  return {
    specialKey: specialKey,
    realKey: realKey
  };
}

function setKeyQueue(maps, kConf, funcName) {
  var _parseKeys = parseKeys(kConf.key),
      specialKey = _parseKeys.specialKey,
      realKey = _parseKeys.realKey;

  var skeyList = maps[realKey];

  if (!skeyList) {
    skeyList = maps[realKey] = [];
  }

  if (skeyList.some(function (skey) {
    return skey.realKey === realKey && skey.specialKey === specialKey;
  })) {
    throw new Error("[vxe-table-plugin-shortcut-key] Shortcut key conflict '".concat(kConf.key, "'."));
  }

  skeyList.push(new SKey(realKey, specialKey, funcName, kConf));
}

function parseDisabledKey(options) {
  _xeUtils["default"].each(options.disabled, function (conf) {
    var opts = _xeUtils["default"].isString(conf) ? {
      key: conf
    } : conf;
    setKeyQueue(disabledMaps, _xeUtils["default"].assign({
      callback: function callback() {
        return false;
      }
    }, opts));
  });
}

function parseSettingKey(options) {
  _xeUtils["default"].each(options.setting, function (opts, funcName) {
    var kConf = _xeUtils["default"].isString(opts) ? {
      key: opts
    } : opts;

    if (!handleFuncs[funcName]) {
      console.warn("[vxe-table-plugin-shortcut-key] '".concat(funcName, "' not exist."));
    }

    setKeyQueue(settingMaps, kConf, funcName);
  });
}

function parseListenerKey(options) {
  _xeUtils["default"].each(options.listener, function (callback, key) {
    if (!_xeUtils["default"].isFunction(callback)) {
      console.warn("[vxe-table-plugin-shortcut-key] '".concat(key, "' requires the callback function to be set."));
    }

    setKeyQueue(listenerMaps, {
      key: key,
      callback: callback
    });
  });
}
/**
 * 基于 vxe-table 表格的增强插件，为键盘操作提供快捷键的设置
 */


var VXETablePluginShortcutKey = {
  install: function install(xtable, options) {
    if (options) {
      parseDisabledKey(options);
      parseSettingKey(options);
      parseListenerKey(options);
      xtable.interceptor.add('event.keydown', handleShortcutKeyEvent);
    }
  }
};
exports.VXETablePluginShortcutKey = VXETablePluginShortcutKey;

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginShortcutKey);
}

var _default = VXETablePluginShortcutKey;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImFycm93S2V5cyIsInNwbGl0Iiwic3BlY2lhbEtleXMiLCJzZXR0aW5nTWFwcyIsImxpc3RlbmVyTWFwcyIsImRpc2FibGVkTWFwcyIsIlNLZXkiLCJyZWFsS2V5Iiwic3BlY2lhbEtleSIsImZ1bmNOYW1lIiwia0NvbmYiLCJwYXJhbXMiLCJldm50IiwiaGFuZGxlRnVuY3MiLCJjYWxsYmFjayIsImdldEV2ZW50S2V5Iiwia2V5IiwiaW5kZXhPZiIsInRvTG93ZXJDYXNlIiwiaXNUcmlnZ2VyUGFnZSIsIiR0YWJsZSIsImdldEFjdGl2ZVJvdyIsImhhbmRsZUNoYW5nZVBhZ2UiLCJmdW5jIiwibW91c2VDb25maWciLCIkZ3JpZCIsInNlbGVjdGVkIiwidGFyZ2V0IiwidGFnTmFtZSIsInBhZ2VyIiwiJHJlZnMiLCJwcmV2ZW50RGVmYXVsdCIsImhhbmRsZVRhYk1vdmUiLCJpc0xlZnQiLCJhY3RpdmVkIiwiZ2V0TW91c2VTZWxlY3RlZHMiLCJtb3ZlVGFiU2VsZWN0ZWQiLCJoYW5kbGVBcnJvd01vdmUiLCJhcnJvd0luZGV4IiwiYXJyb3dzIiwibW92ZVNlbGVjdGVkIiwic2V0QWN0aXZlQ2VsbCIsInJvdyIsImNvbHVtbiIsInByb3BlcnR5IiwiY2xlYXJBY3RpdmVkIiwiJG5leHRUaWNrIiwic2V0U2VsZWN0Q2VsbCIsInJ1bkV2ZW50IiwibWFwcyIsInByb3AiLCJza2V5TGlzdCIsInNvbWUiLCJza2V5IiwiaGFuZGxlU2hvcnRjdXRLZXlFdmVudCIsInBhcnNlS2V5cyIsImtleXMiLCJmb3JFYWNoIiwiaXRlbSIsInRyaW0iLCJsZW5ndGgiLCJFcnJvciIsInNldEtleVF1ZXVlIiwicHVzaCIsInBhcnNlRGlzYWJsZWRLZXkiLCJvcHRpb25zIiwiWEVVdGlscyIsImVhY2giLCJkaXNhYmxlZCIsImNvbmYiLCJvcHRzIiwiaXNTdHJpbmciLCJhc3NpZ24iLCJwYXJzZVNldHRpbmdLZXkiLCJzZXR0aW5nIiwiY29uc29sZSIsIndhcm4iLCJwYXJzZUxpc3RlbmVyS2V5IiwibGlzdGVuZXIiLCJpc0Z1bmN0aW9uIiwiVlhFVGFibGVQbHVnaW5TaG9ydGN1dEtleSIsImluc3RhbGwiLCJ4dGFibGUiLCJpbnRlcmNlcHRvciIsImFkZCIsIndpbmRvdyIsIlZYRVRhYmxlIiwidXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7QUFFQSxJQUFNQSxTQUFTLEdBQUcscUJBQXFCQyxLQUFyQixDQUEyQixHQUEzQixDQUFsQjtBQUNBLElBQU1DLFdBQVcsR0FBRyxzQkFBc0JELEtBQXRCLENBQTRCLEdBQTVCLENBQXBCO0FBQ0EsSUFBTUUsV0FBVyxHQUFHLEVBQXBCO0FBQ0EsSUFBTUMsWUFBWSxHQUFHLEVBQXJCO0FBQ0EsSUFBTUMsWUFBWSxHQUFHLEVBQXJCOztJQXNCYUMsSTs7O0FBS1gsZ0JBQWFDLE9BQWIsRUFBOEJDLFVBQTlCLEVBQWtEQyxRQUFsRCxFQUF1RUMsS0FBdkUsRUFBNkY7QUFBQTs7QUFDM0YsU0FBS0gsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQkEsVUFBbEI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLFNBQUtDLEtBQUwsR0FBYUEsS0FBYjtBQUNEOzs7U0FDRDtBQUFBOzs0QkFBcUJDLE0sRUFBYUMsSSxFQUFTO0FBQ3pDLFVBQUksQ0FBQyxLQUFLSixVQUFOLElBQW9CSSxJQUFJLFdBQUksS0FBS0osVUFBVCxTQUE1QixFQUF1RDtBQUNyRCxlQUFPSyxXQUFXLENBQUMsS0FBS0osUUFBTixDQUFYLENBQTJCRSxNQUEzQixFQUFtQ0MsSUFBbkMsQ0FBUDtBQUNEO0FBQ0Y7O1NBQ0Q7QUFBQTs7eUJBQWtCRCxNLEVBQWFDLEksRUFBUztBQUN0QyxVQUFJLENBQUMsS0FBS0osVUFBTixJQUFvQkksSUFBSSxXQUFJLEtBQUtKLFVBQVQsU0FBNUIsRUFBdUQ7QUFDckQsZUFBTyxLQUFLRSxLQUFMLENBQVdJLFFBQVgsQ0FBb0JI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QUN2Q0MsRUFBQUEsT0FEdUMsbUJBQzlCQyxNQUQ4QixFQUNqQmpCLE9BRGlCLEVBQ1c7QUFDaEQsUUFBSUEsT0FBSixFQUFhO0FBQ1hELE1BQUFBLGdCQUFnQixDQUFDQyxPQUFELENBQWhCO0FBQ0FRLE1BQUFBLGVBQWUsQ0FBQ1IsT0FBRCxDQUFmO0FBQ0FZLE1BQUFBLGdCQUFnQixDQUFDWixPQUFELENBQWhCO0FBQ0FpQixNQUFBQSxNQUFNLENBQUNDLFdBQVAsQ0FBbUJDLEdBQW5CLENBQXVCLGVBQXZCLEVBQXdDOUIsc0JBQXhDO0FBQ0Q7QUFDRjtBQVJzQyxDQUFsQzs7O0FBaUJQLElBQUksT0FBTytCLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLE1BQU0sQ0FBQ0MsUUFBNUMsRUFBc0Q7QUFDcERELEVBQUFBLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0JQLHlCQUFwQjtBQUNEOztlQUVjQSx5QiIsImZpbGUiOiJpbmRleC5jb21tb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgWEVVdGlscyBmcm9tICd4ZS11dGlscy9tZXRob2RzL3hlLXV0aWxzJ1xyXG4vLyBpbXBvcnQgVlhFVGFibGUgZnJvbSAndnhlLXRhYmxlJ1xyXG5cclxuY29uc3QgYXJyb3dLZXlzID0gJ3JpZ2h0LHVwLGxlZnQsZG93bicuc3BsaXQoJywnKVxyXG5jb25zdCBzcGVjaWFsS2V5cyA9ICdhbHQsY3RybCxzaGlmdCxtZXRhJy5zcGxpdCgnLCcpXHJcbmNvbnN0IHNldHRpbmdNYXBzID0ge31cclxuY29uc3QgbGlzdGVuZXJNYXBzID0ge31cclxuY29uc3QgZGlzYWJsZWRNYXBzID0ge31cclxuXHJcbmV4cG9ydCBjb25zdCBlbnVtIEZVTkNfTkFORSB7XHJcbiAgVEFCTEVfRURJVF9BQ1RJVkVEID0gJ3RhYmxlLmVkaXQuYWN0aXZlZCcsXHJcbiAgVEFCTEVfRURJVF9DTE9TRUQgPSAndGFibGUuZWRpdC5jbG9zZWQnLFxyXG4gIFRBQkxFX0VESVRfUklHSFRUQUJNT1ZFID0gJ3RhYmxlLmVkaXQucmlnaHRUYWJNb3ZlJyxcclxuICBUQUJMRV9FRElUX0xFRlRUQUJNT1ZFID0gJ3RhYmxlLmVkaXQubGVmdFRhYk1vdmUnLFxyXG4gIFRBQkxFX0NFTExfTEVGVE1PVkUgPSAndGFibGUuY2VsbC5sZWZ0TW92ZScsXHJcbiAgVEFCTEVfQ0VMTF9VUE1PVkUgPSAndGFibGUuY2VsbC51cE1vdmUnLFxyXG4gIFRBQkxFX0NFTExfUklHSFRNT1ZFID0gJ3RhYmxlLmNlbGwucmlnaHRNb3ZlJyxcclxuICBUQUJMRV9DRUxMX0RPV05NT1ZFID0gJ3RhYmxlLmNlbGwuZG93bk1vdmUnLFxyXG4gIFBBR0VSX1BSRVZQQUdFID0gJ3BhZ2VyLnByZXZQYWdlJyxcclxuICBQQUdFUl9ORVhUUEFHRSA9ICdwYWdlci5uZXh0UGFnZScsXHJcbiAgUEFHRVJfUFJFVkpVTVAgPSAncGFnZXIucHJldkp1bXAnLFxyXG4gIFBBR0VSX05FWFRKVU1QID0gJ3BhZ2VyLm5leHRKdW1wJ1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZW51bSBTS0VZX05BTkUge1xyXG4gIFRSSUdHRVIgPSAndHJpZ2dlcicsXHJcbiAgRU1JVCA9ICdlbWl0J1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU0tleSB7XHJcbiAgcmVhbEtleTogc3RyaW5nO1xyXG4gIHNwZWNpYWxLZXk6IHN0cmluZztcclxuICBmdW5jTmFtZTogRlVOQ19OQU5FO1xyXG4gIGtDb25mOiBTaG9ydGN1dEtleUNvbmY7XHJcbiAgY29uc3RydWN0b3IgKHJlYWxLZXk6IHN0cmluZywgc3BlY2lhbEtleTogc3RyaW5nLCBmdW5jTmFtZTogRlVOQ19OQU5FLCBrQ29uZjogU2hvcnRjdXRLZXlDb25mKSB7XHJcbiAgICB0aGlzLnJlYWxLZXkgPSByZWFsS2V5XHJcbiAgICB0aGlzLnNwZWNpYWxLZXkgPSBzcGVjaWFsS2V5XHJcbiAgICB0aGlzLmZ1bmNOYW1lID0gZnVuY05hbWVcclxuICAgIHRoaXMua0NvbmYgPSBrQ29uZlxyXG4gIH1cclxuICBbU0tFWV9OQU5FLlRSSUdHRVJdIChwYXJhbXM6IGFueSwgZXZudDogYW55KSB7XHJcbiAgICBpZiAoIXRoaXMuc3BlY2lhbEtleSB8fCBldm50W2Ake3RoaXMuc3BlY2lhbEtleX1LZXlgXSkge1xyXG4gICAgICByZXR1cm4gaGFuZGxlRnVuY3NbdGhpcy5mdW5jTmFtZV0ocGFyYW1zLCBldm50KVxyXG4gICAgfVxyXG4gIH1cclxuICBbU0tFWV9OQU5FLkVNSVRdIChwYXJhbXM6IGFueSwgZXZudDogYW55KSB7XHJcbiAgICBpZiAoIXRoaXMuc3BlY2lhbEtleSB8fCBldm50W2Ake3RoaXMuc3BlY2lhbEtleX1LZXlgXSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5rQ29uZi5jYWxsYmFjayhwYXJhbXMsIGV2bnQpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRFdmVudEtleSAoa2V5OiBzdHJpbmcpIHtcclxuICBpZiAoYXJyb3dLZXlzLmluZGV4T2Yoa2V5LnRvTG93ZXJDYXNlKCkpID4gLTEpIHtcclxuICAgIHJldHVybiBgQXJyb3cke2tleX1gXHJcbiAgfVxyXG4gIHJldHVybiBrZXlcclxufVxyXG5cclxuZnVuY3Rpb24gaXNUcmlnZ2VyUGFnZSAocGFyYW1zOiBhbnkpIHtcclxuICBjb25zdCB7ICR0YWJsZSB9ID0gcGFyYW1zXHJcbiAgcmV0dXJuICEkdGFibGUuZ2V0QWN0aXZlUm93KClcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlQ2hhbmdlUGFnZSAoZnVuYzogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChwYXJhbXM6IGFueSwgZXZudDogYW55KSB7XHJcbiAgICBjb25zdCB7ICR0YWJsZSB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCB7IG1vdXNlQ29uZmlnID0ge30gfSA9ICR0YWJsZVxyXG4gICAgY29uc3QgJGdyaWQgPSAkdGFibGUuJGdyaWRcclxuICAgIGlmICgkZ3JpZCAmJiBtb3VzZUNvbmZpZy5zZWxlY3RlZCAhPT0gdHJ1ZSAmJiBbJ2lucHV0JywgJ3RleHRhcmVhJ10uaW5kZXhPZihldm50LnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpID09PSAtMSAmJiBpc1RyaWdnZXJQYWdlKHBhcmFtcykpIHtcclxuICAgICAgY29uc3QgcGFnZXIgPSAkZ3JpZC4kcmVmcy5wYWdlclxyXG4gICAgICBpZiAocGFnZXIpIHtcclxuICAgICAgICBldm50LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBwYWdlcltmdW5jXShldm50KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVUYWJNb3ZlIChpc0xlZnQ6IGJvb2xlYW4pIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtczogYW55LCBldm50OiBhbnkpIHtcclxuICAgIGNvbnN0IHsgJHRhYmxlIH0gPSBwYXJhbXNcclxuICAgIGNvbnN0IGFjdGl2ZWQgPSAkdGFibGUuZ2V0QWN0aXZlUm93KClcclxuICAgIGNvbnN0IHNlbGVjdGVkID0gJHRhYmxlLmdldE1vdXNlU2VsZWN0ZWRzKClcclxuICAgIGlmIChzZWxlY3RlZCkge1xyXG4gICAgICAkdGFibGUubW92ZVRhYlNlbGVjdGVkKHNlbGVjdGVkLCBpc0xlZnQsIGV2bnQpXHJcbiAgICB9IGVsc2UgaWYgKGFjdGl2ZWQpIHtcclxuICAgICAgJHRhYmxlLm1vdmVUYWJTZWxlY3RlZChhY3RpdmVkLCBpc0xlZnQsIGV2bnQpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUFycm93TW92ZSAoYXJyb3dJbmRleDogbnVtYmVyKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChwYXJhbXM6IGFueSwgZXZudDogYW55KSB7XHJcbiAgICBjb25zdCB7ICR0YWJsZSB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCBzZWxlY3RlZCA9ICR0YWJsZS5nZXRNb3VzZVNlbGVjdGVkcygpXHJcbiAgICBjb25zdCBhcnJvd3MgPSBbMCwgMCwgMCwgMF1cclxuICAgIGFycm93c1thcnJvd0luZGV4XSA9IDFcclxuICAgIGlmIChzZWxlY3RlZCkge1xyXG4gICAgICAkdGFibGUubW92ZVNlbGVjdGVkKHNlbGVjdGVkLCBhcnJvd3NbMF0sIGFycm93c1sxXSwgYXJyb3dzWzJdLCBhcnJvd3NbM10sIGV2bnQpXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOW/q+aNt+mUruWkhOeQhuaWueazlVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGhhbmRsZUZ1bmNzID0ge1xyXG4gIFtGVU5DX05BTkUuVEFCTEVfRURJVF9BQ1RJVkVEXSAocGFyYW1zOiBhbnksIGV2bnQ6IGFueSkge1xyXG4gICAgY29uc3QgeyAkdGFibGUgfSA9IHBhcmFtc1xyXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSAkdGFibGUuZ2V0TW91c2VTZWxlY3RlZHMoKVxyXG4gICAgaWYgKHNlbGVjdGVkKSB7XHJcbiAgICAgIGV2bnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAkdGFibGUuc2V0QWN0aXZlQ2VsbChzZWxlY3RlZC5yb3csIHNlbGVjdGVkLmNvbHVtbi5wcm9wZXJ0eSlcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgfSxcclxuICBbRlVOQ19OQU5FLlRBQkxFX0VESVRfQ0xPU0VEXSAocGFyYW1zOiBhbnksIGV2bnQ6IGFueSkge1xyXG4gICAgY29uc3QgeyAkdGFibGUgfSA9IHBhcmFtc1xyXG4gICAgY29uc3QgeyBtb3VzZUNvbmZpZyA9IHt9IH0gPSAkdGFibGVcclxuICAgIGNvbnN0IGFjdGl2ZWQgPSAkdGFibGUuZ2V0QWN0aXZlUm93KClcclxuICAgIGlmIChhY3RpdmVkKSB7XHJcbiAgICAgIGV2bnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAkdGFibGUuY2xlYXJBY3RpdmVkKGV2bnQpXHJcbiAgICAgIGlmIChtb3VzZUNvbmZpZy5zZWxlY3RlZCkge1xyXG4gICAgICAgICR0YWJsZS4kbmV4dFRpY2soKCkgPT4gJHRhYmxlLnNldFNlbGVjdENlbGwoYWN0aXZlZC5yb3csIGFjdGl2ZWQuY29sdW1uLnByb3BlcnR5KSlcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuICB9LFxyXG4gIFtGVU5DX05BTkUuVEFCTEVfRURJVF9SSUdIVFRBQk1PVkVdOiBoYW5kbGVUYWJNb3ZlKGZhbHNlKSxcclxuICBbRlVOQ19OQU5FLlRBQkxFX0VESVRfTEVGVFRBQk1PVkVdOiBoYW5kbGVUYWJNb3ZlKHRydWUpLFxyXG4gIFtGVU5DX05BTkUuVEFCTEVfQ0VMTF9MRUZUTU9WRV06IGhhbmRsZUFycm93TW92ZSgwKSxcclxuICBbRlVOQ19OQU5FLlRBQkxFX0NFTExfVVBNT1ZFXTogaGFuZGxlQXJyb3dNb3ZlKDEpLFxyXG4gIFtGVU5DX05BTkUuVEFCTEVfQ0VMTF9SSUdIVE1PVkVdOiBoYW5kbGVBcnJvd01vdmUoMiksXHJcbiAgW0ZVTkNfTkFORS5UQUJMRV9DRUxMX0RPV05NT1ZFXTogaGFuZGxlQXJyb3dNb3ZlKDMpLFxyXG4gIFtGVU5DX05BTkUuUEFHRVJfUFJFVlBBR0VdOiBoYW5kbGVDaGFuZ2VQYWdlKCdwcmV2UGFnZScpLFxyXG4gIFtGVU5DX05BTkUuUEFHRVJfTkVYVFBBR0VdOiBoYW5kbGVDaGFuZ2VQYWdlKCduZXh0UGFnZScpLFxyXG4gIFtGVU5DX05BTkUuUEFHRVJfUFJFVkpVTVBdOiBoYW5kbGVDaGFuZ2VQYWdlKCdwcmV2SnVtcCcpLFxyXG4gIFtGVU5DX05BTkUuUEFHRVJfTkVYVEpVTVBdOiBoYW5kbGVDaGFuZ2VQYWdlKCduZXh0SnVtcCcpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJ1bkV2ZW50IChrZXk6IHN0cmluZywgbWFwczogYW55LCBwcm9wOiBTS0VZX05BTkUsIHBhcmFtczogYW55LCBldm50OiBhbnkpIHtcclxuICBsZXQgc2tleUxpc3QgPSBtYXBzW2tleS50b0xvd2VyQ2FzZSgpXVxyXG4gIGlmIChza2V5TGlzdCkge1xyXG4gICAgcmV0dXJuIHNrZXlMaXN0LnNvbWUoKHNrZXk6IFNLZXkpID0+IHNrZXlbcHJvcF0ocGFyYW1zLCBldm50KSA9PT0gZmFsc2UpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVTaG9ydGN1dEtleUV2ZW50IChwYXJhbXM6IGFueSwgZXZudDogYW55KSB7XHJcbiAgbGV0IGtleSA9IGdldEV2ZW50S2V5KGV2bnQua2V5KVxyXG4gIGlmICghcnVuRXZlbnQoa2V5LCBkaXNhYmxlZE1hcHMsIFNLRVlfTkFORS5FTUlULCBwYXJhbXMsIGV2bnQpKSB7XHJcbiAgICBydW5FdmVudChrZXksIHNldHRpbmdNYXBzLCBTS0VZX05BTkUuVFJJR0dFUiwgcGFyYW1zLCBldm50KVxyXG4gICAgcnVuRXZlbnQoa2V5LCBsaXN0ZW5lck1hcHMsIFNLRVlfTkFORS5FTUlULCBwYXJhbXMsIGV2bnQpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUtleXMgKGtleTogc3RyaW5nKSB7XHJcbiAgbGV0IHNwZWNpYWxLZXlcclxuICBsZXQgcmVhbEtleVxyXG4gIGxldCBrZXlzID0ga2V5LnNwbGl0KCcrJylcclxuICBrZXlzLmZvckVhY2goKGl0ZW06IHN0cmluZykgPT4ge1xyXG4gICAgaXRlbSA9IGl0ZW0udG9Mb3dlckNhc2UoKS50cmltKClcclxuICAgIGlmIChzcGVjaWFsS2V5cy5pbmRleE9mKGl0ZW0pID4gLTEpIHtcclxuICAgICAgc3BlY2lhbEtleSA9IGl0ZW1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlYWxLZXkgPSBpdGVtXHJcbiAgICB9XHJcbiAgfSlcclxuICBpZiAoIXJlYWxLZXkgfHwga2V5cy5sZW5ndGggPiAyIHx8IChrZXlzLmxlbmd0aCA9PT0gMiAmJiAhc3BlY2lhbEtleSkpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgW3Z4ZS10YWJsZS1wbHVnaW4tc2hvcnRjdXQta2V5XSBJbnZhbGlkIHNob3J0Y3V0IGtleSBjb25maWd1cmF0aW9uICcke2tleX0nLmApXHJcbiAgfVxyXG4gIHJldHVybiB7IHNwZWNpYWxLZXksIHJlYWxLZXkgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRLZXlRdWV1ZSAobWFwczogYW55LCBrQ29uZjogU2hvcnRjdXRLZXlDb25mLCBmdW5jTmFtZT86IEZVTkNfTkFORSkge1xyXG4gIGxldCB7IHNwZWNpYWxLZXksIHJlYWxLZXkgfSA9IHBhcnNlS2V5cyhrQ29uZi5rZXkpXHJcbiAgbGV0IHNrZXlMaXN0ID0gbWFwc1tyZWFsS2V5XVxyXG4gIGlmICghc2tleUxpc3QpIHtcclxuICAgIHNrZXlMaXN0ID0gbWFwc1tyZWFsS2V5XSA9IFtdXHJcbiAgfVxyXG4gIGlmIChza2V5TGlzdC5zb21lKChza2V5OiBTS2V5KSA9PiBza2V5LnJlYWxLZXkgPT09IHJlYWxLZXkgJiYgc2tleS5zcGVjaWFsS2V5ID09PSBzcGVjaWFsS2V5KSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBbdnhlLXRhYmxlLXBsdWdpbi1zaG9ydGN1dC1rZXldIFNob3J0Y3V0IGtleSBjb25mbGljdCAnJHtrQ29uZi5rZXl9Jy5gKVxyXG4gIH1cclxuICBza2V5TGlzdC5wdXNoKG5ldyBTS2V5KHJlYWxLZXksIHNwZWNpYWxLZXksIGZ1bmNOYW1lLCBrQ29uZikpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlRGlzYWJsZWRLZXkgKG9wdGlvbnM6IFNob3J0Y3V0S2V5T3B0aW9ucykge1xyXG4gIFhFVXRpbHMuZWFjaChvcHRpb25zLmRpc2FibGVkLCAoY29uZjogYW55KSA9PiB7XHJcbiAgICBsZXQgb3B0cyA9IFhFVXRpbHMuaXNTdHJpbmcoY29uZikgPyB7IGtleTogY29uZiB9IDogY29uZlxyXG4gICAgc2V0S2V5UXVldWUoZGlzYWJsZWRNYXBzLCBYRVV0aWxzLmFzc2lnbih7IGNhbGxiYWNrOiAoKSA9PiBmYWxzZSB9LCBvcHRzKSlcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVNldHRpbmdLZXkgKG9wdGlvbnM6IFNob3J0Y3V0S2V5T3B0aW9ucykge1xyXG4gIFhFVXRpbHMuZWFjaChvcHRpb25zLnNldHRpbmcsIChvcHRzOiBhbnksIGZ1bmNOYW1lOiBGVU5DX05BTkUpID0+IHtcclxuICAgIGxldCBrQ29uZiA9IFhFVXRpbHMuaXNTdHJpbmcob3B0cykgPyB7IGtleTogb3B0cyB9IDogb3B0c1xyXG4gICAgaWYgKCFoYW5kbGVGdW5jc1tmdW5jTmFtZV0pIHtcclxuICAgICAgY29uc29sZS53YXJuKGBbdnhlLXRhYmxlLXBsdWdpbi1zaG9ydGN1dC1rZXldICcke2Z1bmNOYW1lfScgbm90IGV4aXN0LmApXHJcbiAgICB9XHJcbiAgICBzZXRLZXlRdWV1ZShzZXR0aW5nTWFwcywga0NvbmYsIGZ1bmNOYW1lKVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlTGlzdGVuZXJLZXkgKG9wdGlvbnM6IFNob3J0Y3V0S2V5T3B0aW9ucykge1xyXG4gIFhFVXRpbHMuZWFjaChvcHRpb25zLmxpc3RlbmVyLCAoY2FsbGJhY2s6IEZ1bmN0aW9uLCBrZXk6IHN0cmluZykgPT4ge1xyXG4gICAgaWYgKCFYRVV0aWxzLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihgW3Z4ZS10YWJsZS1wbHVnaW4tc2hvcnRjdXQta2V5XSAnJHtrZXl9JyByZXF1aXJlcyB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgc2V0LmApXHJcbiAgICB9XHJcbiAgICBzZXRLZXlRdWV1ZShsaXN0ZW5lck1hcHMsIHsga2V5LCBjYWxsYmFjayB9KVxyXG4gIH0pXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU2hvcnRjdXRLZXlDb25mIHtcclxuICBrZXk/OiBzdHJpbmc7XHJcbiAgY2FsbGJhY2s/OiBGdW5jdGlvblxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNob3J0Y3V0S2V5T3B0aW9ucyB7XHJcbiAgZGlzYWJsZWQ6IHN0cmluZyB8IEFycmF5PFNob3J0Y3V0S2V5Q29uZj47XHJcbiAgbGlzdGVuZXI6IG9iamVjdDtcclxuICBzZXR0aW5nOiBvYmplY3Q7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDln7rkuo4gdnhlLXRhYmxlIOihqOagvOeahOWinuW8uuaPkuS7tu+8jOS4uumUruebmOaTjeS9nOaPkOS+m+W/q+aNt+mUrueahOiuvue9rlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFZYRVRhYmxlUGx1Z2luU2hvcnRjdXRLZXkgPSB7XHJcbiAgaW5zdGFsbCAoeHRhYmxlOiBhbnksIG9wdGlvbnM/OiBTaG9ydGN1dEtleU9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zKSB7XHJcbiAgICAgIHBhcnNlRGlzYWJsZWRLZXkob3B0aW9ucylcclxuICAgICAgcGFyc2VTZXR0aW5nS2V5KG9wdGlvbnMpXHJcbiAgICAgIHBhcnNlTGlzdGVuZXJLZXkob3B0aW9ucylcclxuICAgICAgeHRhYmxlLmludGVyY2VwdG9yLmFkZCgnZXZlbnQua2V5ZG93bicsIGhhbmRsZVNob3J0Y3V0S2V5RXZlbnQpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgaW50ZXJmYWNlIFdpbmRvdyB7XHJcbiAgICBWWEVUYWJsZTogYW55XHJcbiAgfVxyXG59XHJcblxyXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LlZYRVRhYmxlKSB7XHJcbiAgd2luZG93LlZYRVRhYmxlLnVzZShWWEVUYWJsZVBsdWdpblNob3J0Y3V0S2V5KVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWWEVUYWJsZVBsdWdpblNob3J0Y3V0S2V5XHJcbiJdfQ==

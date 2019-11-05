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
        if (this.funcName) {
          return handleFuncs[this.funcName](params, evnt);
        }
      }
    }
  }, {
    key: "emit"
    /* EMIT */
    ,
    value: function emit(params, evnt) {
      if (!this.specialKey || evnt["".concat(this.specialKey, "Key")]) {
        if (this.kConf) {
          return this.kConf.callback(params, evnt);
        }
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

function handleCellTabMove(isLeft) {
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

function handleCellMove(arrowIndex) {
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

function handleCurrentRowMove(isDown) {
  return function (params, evnt) {
    var $table = params.$table;

    if ($table.highlightCurrentRow) {
      var currentRow = $table.getCurrentRow();

      if (currentRow) {
        $table.moveCurrentRow(!isDown, isDown, evnt);
        return false;
      }
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
, handleCellTabMove(false)), _defineProperty(_handleFuncs, "table.edit.leftTabMove"
/* TABLE_EDIT_LEFTTABMOVE */
, handleCellTabMove(true)), _defineProperty(_handleFuncs, "table.cell.leftMove"
/* TABLE_CELL_LEFTMOVE */
, handleCellMove(0)), _defineProperty(_handleFuncs, "table.cell.upMove"
/* TABLE_CELL_UPMOVE */
, handleCellMove(1)), _defineProperty(_handleFuncs, "table.cell.rightMove"
/* TABLE_CELL_RIGHTMOVE */
, handleCellMove(2)), _defineProperty(_handleFuncs, "table.cell.downMove"
/* TABLE_CELL_DOWNMOVE */
, handleCellMove(3)), _defineProperty(_handleFuncs, "table.row.current.topMove"
/* TABLE_ROW_CURRENT_TOPMOVE */
, handleCurrentRowMove(false)), _defineProperty(_handleFuncs, "table.row.current.downMove"
/* TABLE_ROW_CURRENT_DOWNMOVE */
, handleCurrentRowMove(true)), _defineProperty(_handleFuncs, "pager.prevPage"
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
  var specialKey = '';
  var realKey = '';
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
    realKey: realKey,
    specialKey: specialKey
  };
}

function setKeyQueue(maps, kConf, funcName) {
  var _parseKeys = parseKeys(kConf.key),
      realKey = _parseKeys.realKey,
      specialKey = _parseKeys.specialKey;

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImFycm93S2V5cyIsInNwbGl0Iiwic3BlY2lhbEtleXMiLCJzZXR0aW5nTWFwcyIsImxpc3RlbmVyTWFwcyIsImRpc2FibGVkTWFwcyIsIlNLZXkiLCJyZWFsS2V5Iiwic3BlY2lhbEtleSIsImZ1bmNOYW1lIiwia0NvbmYiLCJwYXJhbXMiLCJldm50IiwiaGFuZGxlRnVuY3MiLCJjYWxsYmFjayIsImdldEV2ZW50S2V5Iiwia2V5IiwiaW5kZXhPZiIsInRvTG93ZXJDYXNlIiwiaXNUcmlnZ2VyUGFnZSIsIiR0YWJsZSIsImdldEFjdGl2ZVJvdyIsImhhbmRsZUNoYW5nZVBhZ2UiLCJmdW5jIiwibW91c2VDb25maWciLCIkZ3JpZCIsInNlbGVjdGVkIiwidGFyZ2V0IiwidGFnTmFtZSIsInBhZ2VyIiwiJHJlZnMiLCJwcmV2ZW50RGVmYXVsdCIsImhhbmRsZUNlbGxUYWJNb3ZlIiwiaXNMZWZ0IiwiYWN0aXZlZCIsImdldE1vdXNlU2VsZWN0ZWRzIiwibW92ZVRhYlNlbGVjdGVkIiwiaGFuZGxlQ2VsbE1vdmUiLCJhcnJvd0luZGV4IiwiYXJyb3dzIiwibW92ZVNlbGVjdGVkIiwiaGFuZGxlQ3VycmVudFJvd01vdmUiLCJpc0Rvd24iLCJoaWdobGlnaHRDdXJyZW50Um93IiwiY3VycmVudFJvdyIsImdldEN1cnJlbnRSb3ciLCJtb3ZlQ3VycmVudFJvdyIsInNldEFjdGl2ZUNlbGwiLCJyb3ciLCJjb2x1bW4iLCJwcm9wZXJ0eSIsImNsZWFyQWN0aXZlZCIsIiRuZXh0VGljayIsInNldFNlbGVjdENlbGwiLCJydW5FdmVudCIsIm1hcHMiLCJwcm9wIiwic2tleUxpc3QiLCJzb21lIiwic2tleSIsImhhbmRsZVNob3J0Y3V0S2V5RXZlbnQiLCJwYXJzZUtleXMiLCJrZXlzIiwiZm9yRWFjaCIsIml0ZW0iLCJ0cmltIiwibGVuZ3RoIiwiRXJyb3IiLCJzZXRLZXlRdWV1ZSIsInB1c2giLCJwYXJzZURpc2FibGVkS2V5Iiwib3B0aW9ucyIsIlhFVXRpbHMiLCJlYWNoIiwiZGlzYWJsZWQiLCJjb25mIiwib3B0cyIsImlzU3RyaW5nIiwiYXNzaWduIiwicGFyc2VTZXR0aW5nS2V5Iiwic2V0dGluZyIsImNvbnNvbGUiLCJ3YXJuIiwicGFyc2VMaXN0ZW5lcktleSIsImxpc3RlbmVyIiwiaXNGdW5jdGlvbiIsIlZYRVRhYmxlUGx1Z2luU2hvcnRjdXRLZXkiLCJpbnN0YWxsIiwieHRhYmxlIiwiaW50ZXJjZXB0b3IiLCJhZGQiLCJ3aW5kb3ciLCJWWEVUYWJsZSIsInVzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7OztBQU9BLElBQU1BLFNBQVMsR0FBRyxxQkFBcUJDLEtBQXJCLENBQTJCLEdBQTNCLENBQWxCO0FBQ0EsSUFBTUMsV0FBVyxHQUFHLHNCQUFzQkQsS0FBdEIsQ0FBNEIsR0FBNUIsQ0FBcEI7QUFDQSxJQUFNRSxXQUFXLEdBQWlCLEVBQWxDO0FBQ0EsSUFBTUMsWUFBWSxHQUFpQixFQUFuQztBQUNBLElBQU1DLFlBQVksR0FBaUIsRUFBbkM7O0lBd0JhQyxJOzs7QUFLWCxnQkFBWUMsT0FBWixFQUE2QkMsVUFBN0IsRUFBaURDLFFBQWpELEVBQXVFQyxLQUF2RSxFQUE4RjtBQUFBOztBQUM1RixTQUFLSCxPQUFMLEdBQWVBLE9BQWY7QUFDQSxTQUFLQyxVQUFMLEdBQWtCQSxVQUFsQjtBQUNBLFNBQUtDLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0EsU0FBS0MsS0FBTCxHQUFhQSxLQUFiO0FBQ0Q7OztTQUNEO0FBQUE7OzRCQUFvQkMsTSxFQUFhQyxJLEVBQVM7QUFDeEMsVUFBSSxDQUFDLEtBQUtKLFVBQU4sSUFBb0JJLElBQUksV0FBSSxLQUFLSixVQUFULFNBQTVCLEVBQXVEO0FBQ3JELFlBQUksS0FBS0MsUUFBVCxFQUFtQjtBQUNqQixpQkFBT0ksV0FBVyxDQUFDLEtBQUtKLFFBQU4sQ0FBWCxDQUEyQkUsTUFBM0IsRUFBbUNDLElBQW5DLENBQVA7QUFDRDtBQUNGO0FBQ0Y7O1NBQ0Q7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QUNGO0FBUnNDLENBQWxDOzs7QUFXUCxJQUFJLE9BQU8rQixNQUFQLEtBQWtCLFdBQWxCLElBQWlDQSxNQUFNLENBQUNDLFFBQTVDLEVBQXNEO0FBQ3BERCxFQUFBQSxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLEdBQWhCLENBQW9CUCx5QkFBcEI7QUFDRDs7ZUFFY0EseUIiLCJmaWxlIjoiaW5kZXguY29tbW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFhFVXRpbHMgZnJvbSAneGUtdXRpbHMvbWV0aG9kcy94ZS11dGlscydcclxuaW1wb3J0IFZYRVRhYmxlIGZyb20gJ3Z4ZS10YWJsZS9saWIvdnhlLXRhYmxlJ1xyXG5cclxuaW50ZXJmYWNlIEtleVN0b3JlTWFwcyB7XHJcbiAgW3Byb3BOYW1lOiBzdHJpbmddOiBhbnlbXTtcclxufVxyXG5cclxuY29uc3QgYXJyb3dLZXlzID0gJ3JpZ2h0LHVwLGxlZnQsZG93bicuc3BsaXQoJywnKVxyXG5jb25zdCBzcGVjaWFsS2V5cyA9ICdhbHQsY3RybCxzaGlmdCxtZXRhJy5zcGxpdCgnLCcpXHJcbmNvbnN0IHNldHRpbmdNYXBzOiBLZXlTdG9yZU1hcHMgPSB7fVxyXG5jb25zdCBsaXN0ZW5lck1hcHM6IEtleVN0b3JlTWFwcyA9IHt9XHJcbmNvbnN0IGRpc2FibGVkTWFwczogS2V5U3RvcmVNYXBzID0ge31cclxuXHJcbmV4cG9ydCBjb25zdCBlbnVtIEZVTkNfTkFORSB7XHJcbiAgVEFCTEVfRURJVF9BQ1RJVkVEID0gJ3RhYmxlLmVkaXQuYWN0aXZlZCcsXHJcbiAgVEFCTEVfRURJVF9DTE9TRUQgPSAndGFibGUuZWRpdC5jbG9zZWQnLFxyXG4gIFRBQkxFX0VESVRfUklHSFRUQUJNT1ZFID0gJ3RhYmxlLmVkaXQucmlnaHRUYWJNb3ZlJyxcclxuICBUQUJMRV9FRElUX0xFRlRUQUJNT1ZFID0gJ3RhYmxlLmVkaXQubGVmdFRhYk1vdmUnLFxyXG4gIFRBQkxFX0NFTExfTEVGVE1PVkUgPSAndGFibGUuY2VsbC5sZWZ0TW92ZScsXHJcbiAgVEFCTEVfQ0VMTF9VUE1PVkUgPSAndGFibGUuY2VsbC51cE1vdmUnLFxyXG4gIFRBQkxFX0NFTExfUklHSFRNT1ZFID0gJ3RhYmxlLmNlbGwucmlnaHRNb3ZlJyxcclxuICBUQUJMRV9DRUxMX0RPV05NT1ZFID0gJ3RhYmxlLmNlbGwuZG93bk1vdmUnLFxyXG4gIFRBQkxFX1JPV19DVVJSRU5UX1RPUE1PVkUgPSAndGFibGUucm93LmN1cnJlbnQudG9wTW92ZScsXHJcbiAgVEFCTEVfUk9XX0NVUlJFTlRfRE9XTk1PVkUgPSAndGFibGUucm93LmN1cnJlbnQuZG93bk1vdmUnLFxyXG4gIFBBR0VSX1BSRVZQQUdFID0gJ3BhZ2VyLnByZXZQYWdlJyxcclxuICBQQUdFUl9ORVhUUEFHRSA9ICdwYWdlci5uZXh0UGFnZScsXHJcbiAgUEFHRVJfUFJFVkpVTVAgPSAncGFnZXIucHJldkp1bXAnLFxyXG4gIFBBR0VSX05FWFRKVU1QID0gJ3BhZ2VyLm5leHRKdW1wJ1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZW51bSBTS0VZX05BTkUge1xyXG4gIFRSSUdHRVIgPSAndHJpZ2dlcicsXHJcbiAgRU1JVCA9ICdlbWl0J1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU0tleSB7XHJcbiAgcmVhbEtleTogc3RyaW5nO1xyXG4gIHNwZWNpYWxLZXk6IHN0cmluZztcclxuICBmdW5jTmFtZT86IEZVTkNfTkFORTtcclxuICBrQ29uZj86IFNob3J0Y3V0S2V5Q29uZjtcclxuICBjb25zdHJ1Y3RvcihyZWFsS2V5OiBzdHJpbmcsIHNwZWNpYWxLZXk6IHN0cmluZywgZnVuY05hbWU/OiBGVU5DX05BTkUsIGtDb25mPzogU2hvcnRjdXRLZXlDb25mKSB7XHJcbiAgICB0aGlzLnJlYWxLZXkgPSByZWFsS2V5XHJcbiAgICB0aGlzLnNwZWNpYWxLZXkgPSBzcGVjaWFsS2V5XHJcbiAgICB0aGlzLmZ1bmNOYW1lID0gZnVuY05hbWVcclxuICAgIHRoaXMua0NvbmYgPSBrQ29uZlxyXG4gIH1cclxuICBbU0tFWV9OQU5FLlRSSUdHRVJdKHBhcmFtczogYW55LCBldm50OiBhbnkpIHtcclxuICAgIGlmICghdGhpcy5zcGVjaWFsS2V5IHx8IGV2bnRbYCR7dGhpcy5zcGVjaWFsS2V5fUtleWBdKSB7XHJcbiAgICAgIGlmICh0aGlzLmZ1bmNOYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIGhhbmRsZUZ1bmNzW3RoaXMuZnVuY05hbWVdKHBhcmFtcywgZXZudClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBbU0tFWV9OQU5FLkVNSVRdKHBhcmFtczogYW55LCBldm50OiBhbnkpIHtcclxuICAgIGlmICghdGhpcy5zcGVjaWFsS2V5IHx8IGV2bnRbYCR7dGhpcy5zcGVjaWFsS2V5fUtleWBdKSB7XHJcbiAgICAgIGlmICh0aGlzLmtDb25mKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMua0NvbmYuY2FsbGJhY2socGFyYW1zLCBldm50KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRFdmVudEtleShrZXk6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgaWYgKGFycm93S2V5cy5pbmRleE9mKGtleS50b0xvd2VyQ2FzZSgpKSA+IC0xKSB7XHJcbiAgICByZXR1cm4gYEFycm93JHtrZXl9YFxyXG4gIH1cclxuICByZXR1cm4ga2V5XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzVHJpZ2dlclBhZ2UocGFyYW1zOiBhbnkpOiBib29sZWFuIHtcclxuICBjb25zdCB7ICR0YWJsZSB9ID0gcGFyYW1zXHJcbiAgcmV0dXJuICEkdGFibGUuZ2V0QWN0aXZlUm93KClcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlQ2hhbmdlUGFnZShmdW5jOiBzdHJpbmcpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtczogYW55LCBldm50OiBhbnkpOiBhbnkge1xyXG4gICAgY29uc3QgeyAkdGFibGUgfSA9IHBhcmFtc1xyXG4gICAgY29uc3QgeyBtb3VzZUNvbmZpZyA9IHt9IH0gPSAkdGFibGVcclxuICAgIGNvbnN0ICRncmlkID0gJHRhYmxlLiRncmlkXHJcbiAgICBpZiAoJGdyaWQgJiYgbW91c2VDb25maWcuc2VsZWN0ZWQgIT09IHRydWUgJiYgWydpbnB1dCcsICd0ZXh0YXJlYSddLmluZGV4T2YoZXZudC50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpKSA9PT0gLTEgJiYgaXNUcmlnZ2VyUGFnZShwYXJhbXMpKSB7XHJcbiAgICAgIGNvbnN0IHBhZ2VyID0gJGdyaWQuJHJlZnMucGFnZXJcclxuICAgICAgaWYgKHBhZ2VyKSB7XHJcbiAgICAgICAgZXZudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgcGFnZXJbZnVuY10oZXZudClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlQ2VsbFRhYk1vdmUoaXNMZWZ0OiBib29sZWFuKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChwYXJhbXM6IGFueSwgZXZudDogYW55KTogYW55IHtcclxuICAgIGNvbnN0IHsgJHRhYmxlIH0gPSBwYXJhbXNcclxuICAgIGNvbnN0IGFjdGl2ZWQgPSAkdGFibGUuZ2V0QWN0aXZlUm93KClcclxuICAgIGNvbnN0IHNlbGVjdGVkID0gJHRhYmxlLmdldE1vdXNlU2VsZWN0ZWRzKClcclxuICAgIGlmIChzZWxlY3RlZCkge1xyXG4gICAgICAkdGFibGUubW92ZVRhYlNlbGVjdGVkKHNlbGVjdGVkLCBpc0xlZnQsIGV2bnQpXHJcbiAgICB9IGVsc2UgaWYgKGFjdGl2ZWQpIHtcclxuICAgICAgJHRhYmxlLm1vdmVUYWJTZWxlY3RlZChhY3RpdmVkLCBpc0xlZnQsIGV2bnQpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUNlbGxNb3ZlKGFycm93SW5kZXg6IG51bWJlcikge1xyXG4gIHJldHVybiBmdW5jdGlvbiAocGFyYW1zOiBhbnksIGV2bnQ6IGFueSk6IGFueSB7XHJcbiAgICBjb25zdCB7ICR0YWJsZSB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCBzZWxlY3RlZCA9ICR0YWJsZS5nZXRNb3VzZVNlbGVjdGVkcygpXHJcbiAgICBjb25zdCBhcnJvd3MgPSBbMCwgMCwgMCwgMF1cclxuICAgIGFycm93c1thcnJvd0luZGV4XSA9IDFcclxuICAgIGlmIChzZWxlY3RlZCkge1xyXG4gICAgICAkdGFibGUubW92ZVNlbGVjdGVkKHNlbGVjdGVkLCBhcnJvd3NbMF0sIGFycm93c1sxXSwgYXJyb3dzWzJdLCBhcnJvd3NbM10sIGV2bnQpXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlQ3VycmVudFJvd01vdmUoaXNEb3duOiBib29sZWFuKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChwYXJhbXM6IGFueSwgZXZudDogYW55KTogYW55IHtcclxuICAgIGNvbnN0IHsgJHRhYmxlIH0gPSBwYXJhbXNcclxuICAgIGlmICgkdGFibGUuaGlnaGxpZ2h0Q3VycmVudFJvdykge1xyXG4gICAgICBjb25zdCBjdXJyZW50Um93ID0gJHRhYmxlLmdldEN1cnJlbnRSb3coKVxyXG4gICAgICBpZiAoY3VycmVudFJvdykge1xyXG4gICAgICAgICR0YWJsZS5tb3ZlQ3VycmVudFJvdyghaXNEb3duLCBpc0Rvd24sIGV2bnQpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDlv6vmjbfplK7lpITnkIbmlrnms5VcclxuICovXHJcbmV4cG9ydCBjb25zdCBoYW5kbGVGdW5jcyA9IHtcclxuICBbRlVOQ19OQU5FLlRBQkxFX0VESVRfQUNUSVZFRF0ocGFyYW1zOiBhbnksIGV2bnQ6IGFueSk6IGFueSB7XHJcbiAgICBjb25zdCB7ICR0YWJsZSB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCBzZWxlY3RlZCA9ICR0YWJsZS5nZXRNb3VzZVNlbGVjdGVkcygpXHJcbiAgICBpZiAoc2VsZWN0ZWQpIHtcclxuICAgICAgZXZudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICR0YWJsZS5zZXRBY3RpdmVDZWxsKHNlbGVjdGVkLnJvdywgc2VsZWN0ZWQuY29sdW1uLnByb3BlcnR5KVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuICB9LFxyXG4gIFtGVU5DX05BTkUuVEFCTEVfRURJVF9DTE9TRURdKHBhcmFtczogYW55LCBldm50OiBhbnkpOiBhbnkge1xyXG4gICAgY29uc3QgeyAkdGFibGUgfSA9IHBhcmFtc1xyXG4gICAgY29uc3QgeyBtb3VzZUNvbmZpZyA9IHt9IH0gPSAkdGFibGVcclxuICAgIGNvbnN0IGFjdGl2ZWQgPSAkdGFibGUuZ2V0QWN0aXZlUm93KClcclxuICAgIGlmIChhY3RpdmVkKSB7XHJcbiAgICAgIGV2bnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAkdGFibGUuY2xlYXJBY3RpdmVkKGV2bnQpXHJcbiAgICAgIGlmIChtb3VzZUNvbmZpZy5zZWxlY3RlZCkge1xyXG4gICAgICAgICR0YWJsZS4kbmV4dFRpY2soKCkgPT4gJHRhYmxlLnNldFNlbGVjdENlbGwoYWN0aXZlZC5yb3csIGFjdGl2ZWQuY29sdW1uLnByb3BlcnR5KSlcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuICB9LFxyXG4gIFtGVU5DX05BTkUuVEFCTEVfRURJVF9SSUdIVFRBQk1PVkVdOiBoYW5kbGVDZWxsVGFiTW92ZShmYWxzZSksXHJcbiAgW0ZVTkNfTkFORS5UQUJMRV9FRElUX0xFRlRUQUJNT1ZFXTogaGFuZGxlQ2VsbFRhYk1vdmUodHJ1ZSksXHJcbiAgW0ZVTkNfTkFORS5UQUJMRV9DRUxMX0xFRlRNT1ZFXTogaGFuZGxlQ2VsbE1vdmUoMCksXHJcbiAgW0ZVTkNfTkFORS5UQUJMRV9DRUxMX1VQTU9WRV06IGhhbmRsZUNlbGxNb3ZlKDEpLFxyXG4gIFtGVU5DX05BTkUuVEFCTEVfQ0VMTF9SSUdIVE1PVkVdOiBoYW5kbGVDZWxsTW92ZSgyKSxcclxuICBbRlVOQ19OQU5FLlRBQkxFX0NFTExfRE9XTk1PVkVdOiBoYW5kbGVDZWxsTW92ZSgzKSxcclxuICBbRlVOQ19OQU5FLlRBQkxFX1JPV19DVVJSRU5UX1RPUE1PVkVdOiBoYW5kbGVDdXJyZW50Um93TW92ZShmYWxzZSksXHJcbiAgW0ZVTkNfTkFORS5UQUJMRV9ST1dfQ1VSUkVOVF9ET1dOTU9WRV06IGhhbmRsZUN1cnJlbnRSb3dNb3ZlKHRydWUpLFxyXG4gIFtGVU5DX05BTkUuUEFHRVJfUFJFVlBBR0VdOiBoYW5kbGVDaGFuZ2VQYWdlKCdwcmV2UGFnZScpLFxyXG4gIFtGVU5DX05BTkUuUEFHRVJfTkVYVFBBR0VdOiBoYW5kbGVDaGFuZ2VQYWdlKCduZXh0UGFnZScpLFxyXG4gIFtGVU5DX05BTkUuUEFHRVJfUFJFVkpVTVBdOiBoYW5kbGVDaGFuZ2VQYWdlKCdwcmV2SnVtcCcpLFxyXG4gIFtGVU5DX05BTkUuUEFHRVJfTkVYVEpVTVBdOiBoYW5kbGVDaGFuZ2VQYWdlKCduZXh0SnVtcCcpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJ1bkV2ZW50KGtleTogc3RyaW5nLCBtYXBzOiBhbnksIHByb3A6IFNLRVlfTkFORSwgcGFyYW1zOiBhbnksIGV2bnQ6IGFueSkge1xyXG4gIGxldCBza2V5TGlzdCA9IG1hcHNba2V5LnRvTG93ZXJDYXNlKCldXHJcbiAgaWYgKHNrZXlMaXN0KSB7XHJcbiAgICByZXR1cm4gc2tleUxpc3Quc29tZSgoc2tleTogU0tleSkgPT4gc2tleVtwcm9wXShwYXJhbXMsIGV2bnQpID09PSBmYWxzZSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZVNob3J0Y3V0S2V5RXZlbnQocGFyYW1zOiBhbnksIGV2bnQ6IGFueSkge1xyXG4gIGxldCBrZXkgPSBnZXRFdmVudEtleShldm50LmtleSlcclxuICBpZiAoIXJ1bkV2ZW50KGtleSwgZGlzYWJsZWRNYXBzLCBTS0VZX05BTkUuRU1JVCwgcGFyYW1zLCBldm50KSkge1xyXG4gICAgcnVuRXZlbnQoa2V5LCBzZXR0aW5nTWFwcywgU0tFWV9OQU5FLlRSSUdHRVIsIHBhcmFtcywgZXZudClcclxuICAgIHJ1bkV2ZW50KGtleSwgbGlzdGVuZXJNYXBzLCBTS0VZX05BTkUuRU1JVCwgcGFyYW1zLCBldm50KVxyXG4gIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIHBhcnNlS2V5UmVzdCB7XHJcbiAgcmVhbEtleTogc3RyaW5nO1xyXG4gIHNwZWNpYWxLZXk6IHN0cmluZztcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VLZXlzKGtleTogc3RyaW5nKTogcGFyc2VLZXlSZXN0IHtcclxuICBsZXQgc3BlY2lhbEtleSA9ICcnXHJcbiAgbGV0IHJlYWxLZXkgPSAnJ1xyXG4gIGxldCBrZXlzID0ga2V5LnNwbGl0KCcrJylcclxuICBrZXlzLmZvckVhY2goKGl0ZW06IHN0cmluZykgPT4ge1xyXG4gICAgaXRlbSA9IGl0ZW0udG9Mb3dlckNhc2UoKS50cmltKClcclxuICAgIGlmIChzcGVjaWFsS2V5cy5pbmRleE9mKGl0ZW0pID4gLTEpIHtcclxuICAgICAgc3BlY2lhbEtleSA9IGl0ZW1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlYWxLZXkgPSBpdGVtXHJcbiAgICB9XHJcbiAgfSlcclxuICBpZiAoIXJlYWxLZXkgfHwga2V5cy5sZW5ndGggPiAyIHx8IChrZXlzLmxlbmd0aCA9PT0gMiAmJiAhc3BlY2lhbEtleSkpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgW3Z4ZS10YWJsZS1wbHVnaW4tc2hvcnRjdXQta2V5XSBJbnZhbGlkIHNob3J0Y3V0IGtleSBjb25maWd1cmF0aW9uICcke2tleX0nLmApXHJcbiAgfVxyXG4gIHJldHVybiB7IHJlYWxLZXksIHNwZWNpYWxLZXkgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRLZXlRdWV1ZShtYXBzOiBLZXlTdG9yZU1hcHMsIGtDb25mOiBTaG9ydGN1dEtleUNvbmYsIGZ1bmNOYW1lPzogRlVOQ19OQU5FKSB7XHJcbiAgbGV0IHsgcmVhbEtleSwgc3BlY2lhbEtleSB9ID0gcGFyc2VLZXlzKGtDb25mLmtleSlcclxuICBsZXQgc2tleUxpc3QgPSBtYXBzW3JlYWxLZXldXHJcbiAgaWYgKCFza2V5TGlzdCkge1xyXG4gICAgc2tleUxpc3QgPSBtYXBzW3JlYWxLZXldID0gW11cclxuICB9XHJcbiAgaWYgKHNrZXlMaXN0LnNvbWUoKHNrZXk6IFNLZXkpID0+IHNrZXkucmVhbEtleSA9PT0gcmVhbEtleSAmJiBza2V5LnNwZWNpYWxLZXkgPT09IHNwZWNpYWxLZXkpKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFt2eGUtdGFibGUtcGx1Z2luLXNob3J0Y3V0LWtleV0gU2hvcnRjdXQga2V5IGNvbmZsaWN0ICcke2tDb25mLmtleX0nLmApXHJcbiAgfVxyXG4gIHNrZXlMaXN0LnB1c2gobmV3IFNLZXkocmVhbEtleSwgc3BlY2lhbEtleSwgZnVuY05hbWUsIGtDb25mKSlcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VEaXNhYmxlZEtleShvcHRpb25zOiBTaG9ydGN1dEtleU9wdGlvbnMpIHtcclxuICBYRVV0aWxzLmVhY2gob3B0aW9ucy5kaXNhYmxlZCwgKGNvbmY6IGFueSkgPT4ge1xyXG4gICAgbGV0IG9wdHMgPSBYRVV0aWxzLmlzU3RyaW5nKGNvbmYpID8geyBrZXk6IGNvbmYgfSA6IGNvbmZcclxuICAgIHNldEtleVF1ZXVlKGRpc2FibGVkTWFwcywgWEVVdGlscy5hc3NpZ24oeyBjYWxsYmFjazogKCkgPT4gZmFsc2UgfSwgb3B0cykpXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VTZXR0aW5nS2V5KG9wdGlvbnM6IFNob3J0Y3V0S2V5T3B0aW9ucykge1xyXG4gIFhFVXRpbHMuZWFjaChvcHRpb25zLnNldHRpbmcsIChvcHRzOiBhbnksIGZ1bmNOYW1lOiBGVU5DX05BTkUpID0+IHtcclxuICAgIGxldCBrQ29uZiA9IFhFVXRpbHMuaXNTdHJpbmcob3B0cykgPyB7IGtleTogb3B0cyB9IDogb3B0c1xyXG4gICAgaWYgKCFoYW5kbGVGdW5jc1tmdW5jTmFtZV0pIHtcclxuICAgICAgY29uc29sZS53YXJuKGBbdnhlLXRhYmxlLXBsdWdpbi1zaG9ydGN1dC1rZXldICcke2Z1bmNOYW1lfScgbm90IGV4aXN0LmApXHJcbiAgICB9XHJcbiAgICBzZXRLZXlRdWV1ZShzZXR0aW5nTWFwcywga0NvbmYsIGZ1bmNOYW1lKVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlTGlzdGVuZXJLZXkob3B0aW9uczogU2hvcnRjdXRLZXlPcHRpb25zKSB7XHJcbiAgWEVVdGlscy5lYWNoKG9wdGlvbnMubGlzdGVuZXIsIChjYWxsYmFjazogRnVuY3Rpb24sIGtleTogc3RyaW5nKSA9PiB7XHJcbiAgICBpZiAoIVhFVXRpbHMuaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcclxuICAgICAgY29uc29sZS53YXJuKGBbdnhlLXRhYmxlLXBsdWdpbi1zaG9ydGN1dC1rZXldICcke2tleX0nIHJlcXVpcmVzIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBzZXQuYClcclxuICAgIH1cclxuICAgIHNldEtleVF1ZXVlKGxpc3RlbmVyTWFwcywgeyBrZXksIGNhbGxiYWNrIH0pXHJcbiAgfSlcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTaG9ydGN1dEtleUNvbmYge1xyXG4gIGtleTogc3RyaW5nO1xyXG4gIGNhbGxiYWNrOiBGdW5jdGlvblxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNob3J0Y3V0S2V5T3B0aW9ucyB7XHJcbiAgZGlzYWJsZWQ6IHN0cmluZyB8IFNob3J0Y3V0S2V5Q29uZltdO1xyXG4gIGxpc3RlbmVyOiBvYmplY3Q7XHJcbiAgc2V0dGluZzogb2JqZWN0O1xyXG59XHJcblxyXG4vKipcclxuICog5Z+65LqOIHZ4ZS10YWJsZSDooajmoLznmoTlop7lvLrmj5Lku7bvvIzkuLrplK7nm5jmk43kvZzmj5Dkvpvlv6vmjbfplK7nmoTorr7nva5cclxuICovXHJcbmV4cG9ydCBjb25zdCBWWEVUYWJsZVBsdWdpblNob3J0Y3V0S2V5ID0ge1xyXG4gIGluc3RhbGwoeHRhYmxlOiB0eXBlb2YgVlhFVGFibGUsIG9wdGlvbnM/OiBTaG9ydGN1dEtleU9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zKSB7XHJcbiAgICAgIHBhcnNlRGlzYWJsZWRLZXkob3B0aW9ucylcclxuICAgICAgcGFyc2VTZXR0aW5nS2V5KG9wdGlvbnMpXHJcbiAgICAgIHBhcnNlTGlzdGVuZXJLZXkob3B0aW9ucylcclxuICAgICAgeHRhYmxlLmludGVyY2VwdG9yLmFkZCgnZXZlbnQua2V5ZG93bicsIGhhbmRsZVNob3J0Y3V0S2V5RXZlbnQpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LlZYRVRhYmxlKSB7XHJcbiAgd2luZG93LlZYRVRhYmxlLnVzZShWWEVUYWJsZVBsdWdpblNob3J0Y3V0S2V5KVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWWEVUYWJsZVBsdWdpblNob3J0Y3V0S2V5XHJcbiJdfQ==

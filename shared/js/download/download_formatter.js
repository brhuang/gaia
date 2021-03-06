/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

/**
 * This lib relies on `l10n.js' to implement localizable date/time strings.
 *
 * The proposed `DownloadFormatter' object provides features for formatting
 * the data retrieved from the new API for Downloads, taking into account
 * the structure defined by the API itself.
 * WARNING: this library relies on the non-standard `toLocaleFormat()' method,
 * which is specific to Firefox -- no other browser is supported.
 */



(function(exports) {
  'use strict';

  var NUMBER_OF_DECIMALS = 2;
  var BYTE_SCALE = ['B', 'KB', 'MB', 'GB', 'TB'];

  function _log1024(number) {
    return Math.log(number) / Math.log(1024);
  }

  function _getFormattedSize(bytes) {
    var _ = navigator.mozL10n.get;
    var index = parseInt(Math.round(_log1024(bytes)));
    var value = (bytes / Math.pow(1024, index)).toFixed(NUMBER_OF_DECIMALS);

    return _('fileSize', {
      size: value,
      unit: _('byteUnit-' + BYTE_SCALE[index])
    });
  }

  function _calcPercentage(currently, total) {
    var percentage = (100 * currently) / total;
    var noPrecisionNeeded = !((100 * currently) % total);
    return !noPrecisionNeeded ?
      percentage.toFixed(NUMBER_OF_DECIMALS) : percentage;
  }


  var DownloadFormatter = {
    getFormattedSize: function(bytes) {
      return _getFormattedSize(bytes);
    },
    getFormattedPercentage: function(partial, total) {
      return _calcPercentage(partial, total);
    },
    getFileName: function(download) {
      var tmpAnchorElement = document.createElement('a');
      tmpAnchorElement.href = download.url;
      return tmpAnchorElement.pathname.split('/').pop(); // filename.php
    },
    getTotalSize: function(download) {
      var bytes = download.totalBytes;
      return _getFormattedSize(bytes);
    },
    getDownloadedSize: function(download) {
      var bytes = download.currentBytes;
      return _getFormattedSize(bytes);
    },
    getDownloadedPercentage: function(download) {
      var totalBytes = download.totalBytes;
      var downloadedBytes = download.currentBytes;
      return _calcPercentage(downloadedBytes, totalBytes);
    },
    getDate: function(download, callback) {
      var date = download.startTime;
      LazyLoader.load(['shared/js/l10n_date.js'], function onload() {
        var prettyDate = navigator.mozL10n.DateTimeFormat().fromNow(date, true);
        callback && callback(prettyDate);
      });
    },
    getUUID: function(download) {
      return this.getFileName(download) + download.startTime.getTime();
    }
  };

  exports.DownloadFormatter = DownloadFormatter;

}(this));

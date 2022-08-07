// Generated by CoffeeScript 1.9.3

/*
Version: 1.4.0
Author: Michael Kefeder
https://github.com/mike-kfed/roundcube-thunderbird_labels
 */
var escape_jquery_selector, i18n_label, rcm_tb_label_css, rcm_tb_label_find_main_window, rcm_tb_label_flag_msgs, rcm_tb_label_flag_toggle, rcm_tb_label_get_selection, rcm_tb_label_global, rcm_tb_label_global_set, rcm_tb_label_insert, rcm_tb_label_menuclick, rcm_tb_label_submenu, rcm_tb_label_toggle, rcm_tb_label_unflag_msgs, rcmail_ctxm_label, rcmail_ctxm_label_set,
  slice = [].slice;


$(function() {
  var css, labelbox_parent, labels_for_message;
  css = new rcm_tb_label_css;
  css.inject();
  if (rcm_tb_label_global('tb_labels_for_message') == null) {
    rcm_tb_label_global_set('tb_labels_for_message', []);
  }
  if (rcmail.env.tb_label_enable_shortcuts) {
    $(document).keyup(function(e) {
      var cur_a, k, label_no;
      if (e.isComposing || e.keyCode === 229) {
        return;
      }
      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
        return;
      }
      if (e.target.nodeName === 'INPUT') {
        return;
      }
      k = e.which;
      if (k > 47 && k < 58 || k > 95 && k < 106) {
        label_no = k % 48;
        cur_a = $('#tb-label-menu a.label' + label_no);
        if (cur_a) {
          cur_a.click();
        }
      }
    });
  }
  if (window.rcm_contextmenu_register_command) {
    rcm_contextmenu_register_command('ctxm_tb_label', rcmail_ctxm_label, $('#tb_label_ctxm_mainmenu'), 'moreacts', 'after', true);
  }
  labels_for_message = tb_labels_for_message;
  if (labels_for_message) {
    labelbox_parent = $('div.message-headers, #message-header');
    if (!labelbox_parent.length) {
      labelbox_parent = $('table.headers-table');
    }
    labelbox_parent.append('<div id="labelbox" class="' + rcmail.env.tb_label_style + '"></div>');
    labels_for_message.sort(function(a, b) {
      return a - b;
    });
    jQuery.each(labels_for_message, function(idx, val) {
      rcm_tb_label_flag_msgs([-1], val);
    });
    rcm_tb_label_global_set('tb_labels_for_message', labels_for_message);
  }
  rcmail.addEventListener('insertrow', function(event) {
    rcm_tb_label_insert(event.uid, event.row);
  });
  rcmail.addEventListener('init', function(evt) {
    rcmail.register_command('plugin.thunderbird_labels.rcm_tb_label_submenu', rcm_tb_label_submenu, rcmail.env.uid);
    rcmail.register_command('plugin.thunderbird_labels.rcm_tb_label_menuclick', rcm_tb_label_menuclick, rcmail.env.uid);
    if (rcmail.message_list) {
      rcmail.message_list.addEventListener('select', function(list) {
        rcmail.enable_command('plugin.thunderbird_labels.rcm_tb_label_submenu', list.get_selection().length > 0);
        rcmail.enable_command('plugin.thunderbird_labels.rcm_tb_label_menuclick', list.get_selection().length > 0);
      });
    }
  });
  rcmail.addEventListener('responsebeforerefresh', function(p) {
    var default_flags;
    if (p.response.env.recent_flags != null) {
      default_flags = ['SEEN', 'UNSEEN', 'ANSWERED', 'FLAGGED', 'DELETED', 'DRAFT', 'RECENT', 'NONJUNK', 'JUNK'];
      $.each(p.response.env.recent_flags, function(uid, flags) {
        var message, unset_labels;
        message = rcmail.env.messages[uid];
        if (typeof message.flags.tb_labels === 'object') {
          unset_labels = Array.from(message.flags.tb_labels);
        } else {
          unset_labels = ['LABEL1', 'LABEL2', 'LABEL3', 'LABEL4', 'LABEL5'];
        }
        $.each(flags, function(flagname, flagvalue) {
          var pos;
          flagname = flagname.toUpperCase();
          if (flagvalue && jQuery.inArray(flagname, default_flags) === -1) {
            rcm_tb_label_flag_msgs([uid], flagname);
            pos = jQuery.inArray(flagname, unset_labels);
            if (pos > -1) {
              return unset_labels.splice(pos, 1);
            }
          }
        });
        return $.each(unset_labels, function(idx, label_name) {
          console.log("unset", uid, label_name);
          return rcm_tb_label_unflag_msgs([uid], label_name);
        });
      });
    }
  });
  if (window.rcube_mail_ui) {
    rcube_mail_ui.prototype.tb_label_popup_add = function() {
      var add, obj;
      add = {
        "tb-label-menu": {
          id: 'tb-label-menu'
        }
      };
      this.popups = $.extend(this.popups, add);
      obj = $('#' + this.popups['tb-label-menu'].id);
      if (obj.length) {
        this.popups['tb-label-menu'].obj = obj;
      } else {
        delete this.popups['tb-label-menu'];
      }
    };
  }
  if (window.rcube_mail_ui) {
    rcube_mail_ui.prototype.check_tb_popup = function() {
      if (typeof this.popups === 'undefined') {
        return true;
      }
      if (this.popups['tb-label-menu']) {
        return true;
      } else {
        return false;
      }
    };
  }
});

String.prototype.format = function() {
  var args;
  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  return this.replace(/{(\d+)}/g, function(match, number) {
    if (number < args.length) {
      return args[number];
    } else {
      return match;
    }
  });
};

rcm_tb_label_css = (function() {
  function rcm_tb_label_css() {
    this.default_colors = {
      'bg': '#8CC',
      'fg': '#880000',
      'light': '#800',
      'box': '#882200'
    };
    this.label_colors = {
      'LABEL1': {
        'bg': '#FCC',
        'fg': '#FF0000',
        'light': '#f00',
        'box': '#FF2200'
      },
      'LABEL2': {
        'bg': '#FC3',
        'fg': '#FF9900',
        'light': '#f90',
        'box': '#FF9900'
      },
      'LABEL3': {
        'bg': '#3C3',
        'fg': '#009900',
        'light': '#090',
        'box': '#00CC00'
      },
      'LABEL4': {
        'bg': '#99F',
        'fg': '#3333FF',
        'light': '#0CF',
        'box': '#0CF'
      },
      'LABEL5': {
        'bg': '#C9C',
        'fg': '#993399',
        'light': '#B6F',
        'box': '#FF33FF'
      }
    };
  }

  rcm_tb_label_css.prototype.generate = function() {
    var colors, css, escaped_label_name, label_name, ref;
    css = '';
    ref = this.label_colors;
    for (label_name in ref) {
      colors = ref[label_name];
      escaped_label_name = 'tb_label_' + label_name;
      css += "table.{0}\n{\n  background-color: {1};\n}".format(escaped_label_name, colors.bg);
      css += "#messagelist tr.{0} td,\n#messagelist tr.{0} td a,\nspan.{0},\n.records-table tr.selected td span.{0}\n{\n  color: {1} !important;\n}\n\n.toolbarmenu li.{0},\n.toolbarmenu li.{0} a.active\n{\n  color: {2};\n}".format(escaped_label_name, colors.fg, colors.light);
      css += "#messagelist tr.selected.{0} td,\n#messagelist tr.selected.{0} td a\n{\n  color: #FFFFFF;\n  background-color: {1};\n}".format(escaped_label_name, colors.bg);
      css += "div#labelbox span.box_{0}\n{\n  background-color: {1};\n}".format(escaped_label_name, colors.box);
    }
    return css;
  };

  rcm_tb_label_css.prototype.inject = function() {
    return $("<style>").prop("type", "text/css").html(this.generate()).appendTo("head");
  };

  return rcm_tb_label_css;

})();

rcm_tb_label_insert = function(uid, row) {
  var i, j, label_name, len, len1, message, ref, ref1, rowobj, spanobj;
  if (typeof rcmail.env === 'undefined' || typeof rcmail.env.messages === 'undefined') {
    return;
  }
  message = rcmail.env.messages[uid];
  rowobj = $(row.obj);
  rowobj.find('td.subject').append('<span class="tb_label_dots ' + rcmail.env.tb_label_style + '"></span>');
  if (message.flags && message.flags.tb_labels) {
    if (message.flags.tb_labels.length) {
      spanobj = rowobj.find('td.subject span.tb_label_dots');
      message.flags.tb_labels.sort(function(a, b) {
        return a - b;
      });
	  ref = message.flags.tb_labels;
      if (rcmail.env.tb_label_style === 'bullets') {
        for (i = 0, len = ref.length; i < len; i++) {
          label_name = ref[i];
          spanobj.append('<span class="tb_label_' + label_name + '" title="' + i18n_label(label_name) + '">&#8226;</span>');
        }
      } else if (rcmail.env.tb_label_style === 'badges') {
		for (i = 0, len = ref.length; i < len; i++) {
			label_name = ref[i];
			if (rcmail.env.tb_label_custom_labels[label_name]) {
				spanobj.append(
					'<span class="tb_label_badges badge ' +
						label_name.toLowerCase() +
						'">' +
						i18n_label(label_name) +
						'</span>'
				);
			}
		}
      } else {
        for (j = 0, len1 = ref.length; j < len1; j++) {
          label_name = ref[j];
          rowobj.addClass('tb_label_' + label_name);
        }
      }
    }
  }
};

rcm_tb_label_find_main_window = function() {
  var elastic_popup_window, login_form, ms, popup_window, preview_frame, w;
  ms = $('#mainscreen');
  login_form = $('#login-form');
  preview_frame = $('#messagecontframe');
  popup_window = $('body.extwin');
  elastic_popup_window = $('body.action-show');
  if (login_form.length) {
    return window;
  }
  w = window;
  if (ms.length && preview_frame.length) {
    w = window;
  }
  if (!ms.length && !preview_frame.length) {
    w = window.parent;
  }
  if (popup_window.length || elastic_popup_window.length) {
    w = window;
  }
  ms = w.document.getElementById('mainscreen');
  if (!ms) {
    ms = w.document.getElementById('messagelist-content');
    if (!ms) {
      if (elastic_popup_window.length) {
        return w;
      }
      console.log("mainscreen still not found");
      return null;
    }
  }
  return w;
};

rcm_tb_label_global = function(var_name) {
  return rcm_tb_label_find_main_window()[var_name];
};

rcm_tb_label_global_set = function(var_name, value) {
  return rcm_tb_label_find_main_window()[var_name] = value;
};

escape_jquery_selector = function(str) {
  return str.replace('&', '\\&');
};

i18n_label = function(label_name) {
  var custom_str;
  custom_str = rcmail.env.tb_label_custom_labels[label_name];
  if (custom_str) {
    return custom_str;
  } else {
    return label_name;
  }
};

rcm_tb_label_flag_toggle = function(flag_uids, toggle_label_no, onoff) {
  var headers_table, label_box, labels_for_message, pos, preview_frame;
  if (!flag_uids.length) {
    return;
  }
  preview_frame = $('#messagecontframe');
  labels_for_message = rcm_tb_label_global('tb_labels_for_message');
  if (preview_frame.length) {
    headers_table = preview_frame.contents().find('table.headers-table,#message-header');
    label_box = preview_frame.contents().find('#labelbox');
  } else {
    headers_table = $('table.headers-table,#message-header');
    label_box = $('#labelbox');
  }
  if (!rcmail.message_list && !headers_table.length) {
    return;
  }
  if (headers_table.length) {
    if (onoff === true) {
      if (rcmail.env.tb_label_style === 'bullets' || rcmail.env.tb_label_style === 'badges') {
        label_box.find('span.box_tb_label_' + escape_jquery_selector(toggle_label_no)).remove();
        label_box.append('<span class="box_tb_label_' + toggle_label_no + '">' + i18n_label(toggle_label_no) + '</span>');
      } else {
        headers_table.removeClass('tb_label_' + toggle_label_no);
        headers_table.addClass('tb_label_' + toggle_label_no);
      }
      labels_for_message.push(toggle_label_no);
    } else {
      if (rcmail.env.tb_label_style === 'bullets' || rcmail.env.tb_label_style === 'badges') {
        label_box.find('span.box_tb_label_' + escape_jquery_selector(toggle_label_no)).remove();
      } else {
        headers_table.removeClass('tb_label_' + toggle_label_no);
      }
      pos = jQuery.inArray(toggle_label_no, labels_for_message);
      if (pos > -1) {
        labels_for_message.splice(pos, 1);
      }
    }
    labels_for_message = jQuery.grep(labels_for_message, function(v, k) {
      return jQuery.inArray(v, labels_for_message) === k;
    });
    rcm_tb_label_global_set('tb_labels_for_message', labels_for_message);
  }
  if (!rcmail.env.messages) {
    return;
  }
  jQuery.each(flag_uids, function(idx, uid) {
    var message, row, rowobj, spanobj;
    message = rcmail.env.messages[uid];
    row = rcmail.message_list.rows[uid];
    if (onoff === true) {
      if (jQuery.inArray(toggle_label_no, message.flags.tb_labels) > -1) {
        return;
      }
      rowobj = $(row.obj);
      spanobj = rowobj.find('td.subject span.tb_label_dots');
      if (rcmail.env.tb_label_style === 'bullets') {
        spanobj.append('<span class="tb_label_' + toggle_label_no + '" title="' + i18n_label(toggle_label_no) + '">&#8226;</span>');
      } else if (rcmail.env.tb_label_style === 'badges') {
		spanobj.append('<span class="tb_label_badges badge ' + toggle_label_no.toLowerCase() +	'">' + i18n_label(toggle_label_no) + '</span>');
      } else {
        rowobj.addClass('tb_label_' + toggle_label_no);
      }
      message.flags.tb_labels.push(toggle_label_no);
    } else {
      rowobj = $(row.obj);
      if (rcmail.env.tb_label_style === 'bullets') {
        rowobj.find('td.subject span.tb_label_dots span.tb_label_' + toggle_label_no).remove();
      } else if (rcmail.env.tb_label_style === 'badges') {
		rowobj.find('td.subject span.tb_label_dots span.tb_label_badges.' + toggle_label_no.toLowerCase()).remove();
      } else {
        rowobj.removeClass('tb_label_' + toggle_label_no);
      }
      pos = jQuery.inArray(toggle_label_no, message.flags.tb_labels);
      if (pos > -1) {
        message.flags.tb_labels.splice(pos, 1);
      }
    }
  });
};

rcm_tb_label_flag_msgs = function(flag_uids, toggle_label_no) {
  rcm_tb_label_flag_toggle(flag_uids, toggle_label_no, true);
};

rcm_tb_label_unflag_msgs = function(unflag_uids, toggle_label_no) {
  rcm_tb_label_flag_toggle(unflag_uids, toggle_label_no, false);
};

rcm_tb_label_get_selection = function() {
  var selection;
  selection = rcmail.message_list ? rcmail.message_list.get_selection() : [];
  if (selection.length === 0 && rcmail.env.uid) {
    selection = [rcmail.env.uid];
  }
  return selection;
};

rcm_tb_label_menuclick = function(labelname, obj, ev) {
  return rcm_tb_label_toggle(labelname);
};

rcm_tb_label_toggle = function(toggle_label) {
  var selection, toggle_labels, unset_all;
  selection = rcm_tb_label_get_selection();
  if (!selection.length) {
    return;
  }
  if (toggle_label === 'LABEL0') {
    toggle_labels = ['LABEL1', 'LABEL2', 'LABEL3', 'LABEL4', 'LABEL5'];
    unset_all = true;
  } else {
    toggle_labels = [toggle_label];
    unset_all = false;
  }
  toggle_labels.forEach(function(v, k, arr) {
    var first_message, first_toggle_mode, flag_uids, lock, str_flag_uids, str_unflag_uids, toggle_label_no, unflag_uids;
    toggle_label = v;
    toggle_label_no = toggle_label;
    first_toggle_mode = 'on';
    if (rcmail.env.messages) {
      first_message = rcmail.env.messages[selection[0]];
      if (first_message.flags && jQuery.inArray(toggle_label_no, first_message.flags.tb_labels) >= 0) {
        first_toggle_mode = 'off';
      } else {
        first_toggle_mode = 'on';
      }
    } else {
      if (jQuery.inArray(toggle_label_no, rcm_tb_label_global('tb_labels_for_message')) >= 0) {
        first_toggle_mode = 'off';
      }
    }
    flag_uids = [];
    unflag_uids = [];
    jQuery.each(selection, function(idx, uid) {
      var message;
      if (!rcmail.env.messages) {
        if (first_toggle_mode === 'on') {
          flag_uids.push(uid);
        } else {
          unflag_uids.push(uid);
        }
        if (unset_all && unflag_uids.length === 0) {
          unflag_uids.push(uid);
        }
        return;
      }
      message = rcmail.env.messages[uid];
      if (message.flags && jQuery.inArray(toggle_label_no, message.flags.tb_labels) >= 0) {
        if (first_toggle_mode === 'off') {
          unflag_uids.push(uid);
        }
      } else {
        if (first_toggle_mode === 'on') {
          flag_uids.push(uid);
        }
      }
    });
    if (unset_all) {
      flag_uids = [];
    }
    if (flag_uids.length === 0 && unflag_uids.length === 0) {
      return;
    }
    str_flag_uids = flag_uids.join(',');
    str_unflag_uids = unflag_uids.join(',');
    lock = rcmail.set_busy(true, 'loading');
    rcmail.http_request('plugin.thunderbird_labels.set_flags', '_flag_uids=' + str_flag_uids + '&_unflag_uids=' + str_unflag_uids + '&_mbox=' + urlencode(rcmail.env.mailbox) + '&_toggle_label=' + toggle_label, lock);
    rcm_tb_label_flag_msgs(flag_uids, toggle_label_no);
    rcm_tb_label_unflag_msgs(unflag_uids, toggle_label_no);
  });
};

rcmail_ctxm_label = function(command, el, pos) {
  var cur_a, selection;
  selection = rcmail.message_list ? rcmail.message_list.get_selection() : [];
  if (!selection.length && !rcmail.env.uid) {
    return;
  }
  if (!selection.length && rcmail.env.uid) {
    rcmail.message_list.select_row(rcmail.env.uid);
  }
  cur_a = $('#tb-label-menu a.label' + rcmail.tb_label_no);
  if (cur_a) {
    cur_a.click();
  }
};

rcmail_ctxm_label_set = function(which) {
  rcmail.tb_label_no = which;
};

rcm_tb_label_submenu = function(p, obj, ev) {
  if (typeof rcmail_ui === 'undefined') {
    window.rcmail_ui = UI;
  }
  if (!rcmail_ui.show_popup) {
    return;
  }
  if (!rcmail_ui.check_tb_popup()) {
    rcmail_ui.tb_label_popup_add();
  }
  if (typeof rcmail_ui.show_popupmenu === 'undefined') {
    return;
  } else {
    rcmail_ui.show_popupmenu('tb-label-menu', ev);
  }
  return false;
};

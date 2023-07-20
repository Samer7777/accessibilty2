/*! pojo-accessibility - v2.1.0 - 18-12-2022 */
!(function () {
  var t = -1 < navigator.userAgent.toLowerCase().indexOf("webkit"),
    e = -1 < navigator.userAgent.toLowerCase().indexOf("opera"),
    o = -1 < navigator.userAgent.toLowerCase().indexOf("msie");
  (t || e || o) &&
    document.getElementById &&
    window.addEventListener &&
    window.addEventListener(
      "hashchange",
      function () {
        var t,
          e = location.hash.substring(1);
        /^[A-z0-9_-]+$/.test(e) &&
          (t = document.getElementById(e)) &&
          (/^(?:a|select|input|button|textarea)$/i.test(t.tagName) ||
            (t.tabIndex = -1),
          t.focus());
      },
      !1
    );
})(),
  (function (n, t, o, e) {
    "use strict";
    var i = {
      cache: { $document: n(o), $window: n(t) },
      cacheElements: function () {
        (this.cache.$toolbar = n("#pojo-a11y-toolbar")),
          (this.cache.$toolbarLinks = this.cache.$toolbar.find(
            "a.pojo-a11y-toolbar-link"
          )),
          (this.cache.$toolbarToolsLinks = this.cache.$toolbar.find(
            ".pojo-a11y-tools a.pojo-a11y-toolbar-link"
          )),
          (this.cache.$btnToolbarToggle = this.cache.$toolbar.find(
            "div.pojo-a11y-toolbar-toggle > a"
          )),
          (this.cache.$skipToContent = n("#pojo-a11y-skip-content")),
          (this.cache.$body = n("body"));
      },
      settings: {
        minFontSize: 120,
        maxFontSize: 200,
        buttonsClassPrefix: "pojo-a11y-btn-",
        bodyClassPrefix: "pojo-a11y-",
        bodyFontClassPrefix: "pojo-a11y-resize-font-",
        storageKey: "pojo-a11y",
        expires: PojoA11yOptions.save_expiration
          ? 36e5 * PojoA11yOptions.save_expiration
          : 432e5,
      },
      variables: { currentFontSize: 120, currentSchema: null },
      activeActions: {},
      buildElements: function () {
        this.cache.$body.prepend(this.cache.$toolbar),
          this.cache.$body.prepend(this.cache.$skipToContent);
      },
      bindEvents: function () {
        var e = this;
        e.cache.$btnToolbarToggle.on("click", function (t) {
          t.preventDefault(),
            e.cache.$toolbar.toggleClass("pojo-a11y-toolbar-open"),
            e.cache.$toolbar.hasClass("pojo-a11y-toolbar-open")
              ? e.cache.$toolbarLinks.attr("tabindex", "0")
              : e.cache.$toolbarLinks.attr("tabindex", "-1");
        }),
          n(o).on("keyup", function (t) {
            9 === t.which &&
              e.cache.$btnToolbarToggle.is(":focus") &&
              (e.cache.$toolbar.addClass("pojo-a11y-toolbar-open"),
              e.cache.$toolbarLinks.attr("tabindex", "0"));
          }),
          e.bindToolbarButtons();
      },
      bindToolbarButtons: function () {
        var s = this;
        s.cache.$toolbarToolsLinks.on("click", function (t) {
          t.preventDefault();
          var e = n(this),
            o = e.data("action"),
            i = e.data("action-group"),
            a = !1;
          "reset" !== o
            ? (-1 !== ["toggle", "schema"].indexOf(i) &&
                (a = e.hasClass("active")),
              s.activateButton(o, a))
            : s.reset();
        });
      },
      activateButton: function (t, e) {
        var o = this.getButtonByAction(t).data("action-group");
        (this.activeActions[t] = !e),
          this.actions[o].call(this, t, e),
          this.saveToLocalStorage();
      },
      getActiveButtons: function () {
        return this.cache.$toolbarToolsLinks.filter(".active");
      },
      getButtonByAction: function (t) {
        return this.cache.$toolbarToolsLinks.filter(
          "." + this.settings.buttonsClassPrefix + t
        );
      },
      actions: {
        toggle: function (t, e) {
          var o = this.getButtonByAction(t),
            i = e ? "removeClass" : "addClass";
          e ? o.removeClass("active") : o.addClass("active"),
            this.cache.$body[i](this.settings.bodyClassPrefix + t);
        },
        resize: function (t, e) {
          var o = this.variables.currentFontSize;
          "resize-plus" === t &&
            this.settings.maxFontSize > o &&
            (this.variables.currentFontSize += 10),
            "resize-minus" === t &&
              this.settings.minFontSize < o &&
              (this.variables.currentFontSize -= 10),
            e && (this.variables.currentFontSize = this.settings.minFontSize),
            this.cache.$body.removeClass(this.settings.bodyFontClassPrefix + o);
          var i = 120 < this.variables.currentFontSize,
            a = i ? "addClass" : "removeClass";
          this.getButtonByAction("resize-plus")[a]("active"),
            i &&
              this.cache.$body.addClass(
                this.settings.bodyFontClassPrefix +
                  this.variables.currentFontSize
              ),
            (this.activeActions["resize-minus"] = !1),
            (this.activeActions["resize-plus"] = i),
            this.cache.$window.trigger("resize");
        },
        schema: function (t, e) {
          var o = this.variables.currentSchema;
          o &&
            (this.cache.$body.removeClass(this.settings.bodyClassPrefix + o),
            this.getButtonByAction(o).removeClass("active"),
            (this.activeActions[o] = !1),
            this.saveToLocalStorage()),
            e
              ? (this.variables.currentSchema = null)
              : ((o = this.variables.currentSchema = t),
                this.cache.$body.addClass(this.settings.bodyClassPrefix + o),
                this.getButtonByAction(o).addClass("active"));
        },
      },
      reset: function () {
        for (var t in this.activeActions)
          this.activeActions.hasOwnProperty(t) &&
            this.activeActions[t] &&
            this.activateButton(t, !0);
        localStorage.removeItem(this.settings.storageKey);
      },
      saveToLocalStorage: function () {
        if ("1" === PojoA11yOptions.enable_save) {
          this.variables.expires ||
            (this.variables.expires =
              new Date().getTime() + this.settings.expires);
          var t = {
            actions: this.activeActions,
            variables: {
              currentFontSize: this.variables.currentFontSize,
              expires: this.variables.expires,
            },
          };
          localStorage.setItem(this.settings.storageKey, JSON.stringify(t));
        }
      },
      setFromLocalStorage: function () {
        if ("1" === PojoA11yOptions.enable_save) {
          var t = JSON.parse(localStorage.getItem(this.settings.storageKey));
          if (t) {
            var e = new Date();
            if (t.variables.expires < e)
              localStorage.removeItem(this.settings.storageKey);
            else {
              var o = t.actions;
              for (var i in (120 < t.variables.currentFontSize &&
                (t.variables.currentFontSize -= 10),
              n.extend(this.variables, t.variables),
              o))
                o.hasOwnProperty(i) && o[i] && this.activateButton(i, !1);
            }
          }
        }
      },
      handleGlobalOptions: function () {
        "1" === PojoA11yOptions.focusable &&
          this.cache.$body.addClass("pojo-a11y-focusable"),
          "1" === PojoA11yOptions.remove_link_target &&
            n('a[target="_blank"]').attr("target", ""),
          "1" === PojoA11yOptions.add_role_links && n("a").attr("role", "link");
      },
      init: function () {
        this.cacheElements(),
          this.buildElements(),
          this.bindEvents(),
          this.handleGlobalOptions();
      },
    };
    n(o).ready(function (t) {
      i.init(), i.setFromLocalStorage();
    });
  })(jQuery, window, document);

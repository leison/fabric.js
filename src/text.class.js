//= require "object.class"

(function(global) {
  
  "use strict";
  
  var fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend,
      clone = fabric.util.object.clone;

  if (fabric.Text) {    
    fabric.warn('fabric.Text is already defined');
    return;
  }
  if (!fabric.Object) {
    fabric.warn('fabric.Text requires fabric.Object');
    return;
  }
  
  /** 
   * @class Text
   * @extends fabric.Object
   */
  fabric.Text = fabric.util.createClass(fabric.Object, /** @scope fabric.Text.prototype */ {
    
    /**
     * @property
     * @type Number
     */
    fontSize:         40,
    
    /**
     * @property
     * @type Number
     */
    fontWeight:       100,
    
    /**
     * @property
     * @type String
     */
    fontFamily:       'Times_New_Roman',
    
    /**
     * @property
     * @type String
     */
    textDecoration:   '',
    
    /**
     * @property
     * @type String | null
     */
    textShadow:       null,
    
    /**
     * Determines text alignment. Possible values: "left", "center", or "right".
     * @property
     * @type String
     */
    textAlign:        'left',
    
    /**
     * @property
     * @type String
     */
    fontStyle:        '',
    
    /**
     * @property
     * @type Number
     */
    lineHeight:       1.6,
    
    /**
     * @property
     * @type String
     */
    strokeStyle:      '',
    
    /**
     * @property
     * @type Number
     */
    strokeWidth:      1,
    
    /**
     * @property
     * @type String
     */
    backgroundColor:  '',
    
    
    /**
     * @property
     * @type String | null
     */
    path:             null,
    
    /**
     * @property
     * @type String
     */
    type:             'text',
    
    /**
     * Constructor
     * @method initialize
     * @param {String} text
     * @param {Object} [options]
     * @return {fabric.Text} thisArg
     */
    initialize: function(text, options) {
      this._initStateProperties();
      this.text = text;
      this.setOptions(options);
      this.theta = this.angle * Math.PI / 180;
      this.width = this.getWidth();
      this.setCoords();
    },
    
    /**
     * Creates `stateProperties` list on an instance, and adds `fabric.Text` -specific ones to it 
     * (such as "fontFamily", "fontWeight", etc.)
     * @private
     * @method _initStateProperties
     */
    _initStateProperties: function() {
      this.stateProperties = this.stateProperties.concat();
      this.stateProperties.push(
        'fontFamily', 
        'fontWeight', 
        'fontSize', 
        'path', 
        'text', 
        'textDecoration', 
        'textShadow', 
        'textAlign',
        'fontStyle',
        'lineHeight',
        'strokeStyle',
        'strokeWidth',
        'backgroundColor'
      );
      fabric.util.removeFromArray(this.stateProperties, 'width');
    },
    
    /**
     * Returns string representation of an instance
     * @method toString
     * @return {String} String representation of text object
     */
    toString: function() {
      return '#<fabric.Text (' + this.complexity() +
        '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '" }>';
    },
    
    /**
     * @private
     * @method _render
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(ctx) {
      var o = Cufon.textOptions || (Cufon.textOptions = { });
      
      // export options to be used by cufon.js
      o.left = this.left;
      o.top = this.top;
      o.context = ctx;
      o.color = this.fill;
      
      var el = this._initDummyElement();
      
      // set "cursor" to top/left corner
      this.transform(ctx);
      
      // draw text
      Cufon.replaceElement(el, {
        separate: 'none', 
        fontFamily: this.fontFamily,
        fontWeight: this.fontWeight,
        textDecoration: this.textDecoration,
        textShadow: this.textShadow,
        textAlign: this.textAlign,
        fontStyle: this.fontStyle,
        lineHeight: this.lineHeight,
        strokeStyle: this.strokeStyle,
        strokeWidth: this.strokeWidth,
        backgroundColor: this.backgroundColor
      });
      
      // update width, height
      this.width = o.width;
      this.height = o.height;
      this._totalLineHeight = o.totalLineHeight;
      this._fontAscent = o.fontAscent;
      this._bgBoundaries = o.bgBoundaries;
      
      // need to set coords _after_ the width/height was retreived from Cufon
      this.setCoords();
    },
    
    // _render: function(context) {
    //       context.fillStyle = this.fill;
    //       context.font = this.fontSize + 'px ' + this.fontFamily;
    //       this.transform(context);
    //       this.width = context.measureText(this.text).width;
    //       this.height = this.fontSize;
    //       context.fillText(this.text, -this.width / 2, 0);
    //       this.setCoords();
    //     },
    
    /**
     * @private
     * @method _initDummyElement
     */
    _initDummyElement: function() {
      var el = fabric.document.createElement('div'),
          container = fabric.document.createElement('div');
      
      // Cufon doesn't play nice with textDecoration=underline if element doesn't have a parent
      container.appendChild(el);
      el.innerHTML = this.text;
      
      el.style.fontSize = this.fontSize + 'px';
      el.style.letterSpacing = 'normal';
      
      return el;
    },
    
    /**
     * Renders text instance on a specified context
     * @method render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    render: function(ctx, noTransform) {
      ctx.save();
      this._render(ctx);
      if (!noTransform && this.active) {
        this.drawBorders(ctx);
        this.hideCorners || this.drawCorners(ctx);
      }
      ctx.restore();
    },
    
    /**
     * Returns object representation of an instance
     * @method toObject
     * @return {Object} Object representation of text object
     */
    toObject: function() {
      return extend(this.callSuper('toObject'), {
        text:           this.text,
        fontSize:       this.fontSize,
        fontWeight:     this.fontWeight,
        fontFamily:     this.fontFamily,
        fontStyle:      this.fontStyle,
        lineHeight:     this.lineHeight,
        textDecoration: this.textDecoration,
        textShadow:     this.textShadow,
        textAlign:      this.textAlign,
        path:           this.path,
        strokeStyle:    this.strokeStyle,
        strokeWidth:    this.strokeWidth,
        backgroundColor: this.backgroundColor
      });
    },
    
    /**
     * Returns svg representation of an instance
     * @method toSVG
     * @return {string} svg representation of an instance
     */
    toSVG: function() {
      var textSpans = [ ],
          textLines = this.text.split('\n'),
          lineTopOffset = -this._fontAscent - ((this._fontAscent / 5) * this.lineHeight),
          textBgRects = [ ];
      
      var textLeftOffset = -(this.width/2),
          textTopOffset = (this.height/2) - (textLines.length * this.fontSize) - this._totalLineHeight;
      
      for (var i = 0, len = textLines.length; i < len; i++) {
        textSpans.push('<tspan x="0" dy="', lineTopOffset, '">', textLines[i], '</tspan>');
        if (!this.backgroundColor) continue;
        textBgRects.push(
          '<rect fill="', 
            this.backgroundColor, 
            '" x="', 
            textLeftOffset, 
            '" y="', 
            (lineTopOffset * i) - this.height / 2 + (this.lineHeight * 2.6) /* an offset that seems to straighten things out */,
            '" width="', 
            this._bgBoundaries[i].width,
            '" height="', 
            this._bgBoundaries[i].height,
          '"></rect>');
      }
          
      return [
        '<g transform="', this.getSvgTransform(), '">',
          textBgRects.join(''),
          '<text ',
            (this.fontFamily ? 'font-family="\'' + this.fontFamily + '\'" ': ''),
            (this.fontSize ? 'font-size="' + this.fontSize + '" ': ''),
            (this.fontStyle ? 'font-style="' + this.fontStyle + '" ': ''),
            (this.fontWeight ? 'font-weight="' + this.fontWeight + '" ': ''),
            (this.textDecoration ? 'text-decoration="' + this.textDecoration + '" ': ''),
            'style="', this.getSvgStyles(), '" ',
            /* svg starts from left/bottom corner so we normalize height */
            'transform="translate(', textLeftOffset, ' ', textTopOffset, ')">',
            textSpans.join(''),
          '</text>',
        '</g>'
      ].join('');
    },
    
    /**
     * Sets "color" of an instance (alias of `set('fill', &hellip;)`)
     * @method setColor
     * @param {String} value
     * @return {fabric.Text} thisArg
     * @chainable
     */
    setColor: function(value) {
      this.set('fill', value);
      return this;
    },
    
    /**
     * Sets fontSize of an instance and updates its coordinates
     * @method setFontsize
     * @param {Number} value
     * @return {fabric.Text} thisArg
     * @chainable
     */
    setFontsize: function(value) {
      this.set('fontSize', value);
      this.setCoords();
      return this;
    },
    
    /**
     * Returns actual text value of an instance
     * @method getText
     * @return {String}
     */
    getText: function() {
      return this.text;
    },
    
    /**
     * Sets text of an instance, and updates its coordinates
     * @method setText
     * @param {String} value
     * @return {fabric.Text} thisArg
     * @chainable
     */
    setText: function(value) {
      this.set('text', value);
      this.setCoords();
      return this;
    },
    
    /**
     * Sets specified property to a specified value
     * @method set
     * @param {String} name
     * @param {Any} value
     * @return {fabric.Text} thisArg
     * @chainable
     */
    set: function(name, value) {
      if (typeof name == 'object') {
        for (var prop in name) {
          this.set(prop, name[prop]);
        }
      }
      else {
        this[name] = value;
        if (name === 'fontFamily' && this.path) {
          this.path = this.path.replace(/(.*?)([^\/]*)(\.font\.js)/, '$1' + value + '$3');
        }
      }
      return this;
    }
  });
  
  /**
   * Returns fabric.Text instance from an object representation
   * @static
   * @method fromObject
   * @param {Object} object to create an instance from
   * @return {fabric.Text} an instance
   */
  fabric.Text.fromObject = function(object) {
    return new fabric.Text(object.text, clone(object));
  };
  
  /**
   * Returns fabric.Text instance from an SVG element (<b>not yet implemented</b>)
   * @static
   * @method fabric.Text.fromElement
   * @return {fabric.Text} an instance
   */
  fabric.Text.fromElement = function(element) {
    // TODO (kangax): implement this
  };
  
})(typeof exports != 'undefined' ? exports : this);
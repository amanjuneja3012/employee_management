var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['typeahead','backbone.min','jquery-ui.min'], function(typeahead,Backbone) {
  var Spot;
  var global_interval;
  Spot = (function(superClass) {
    extend(Spot, superClass);

    function Spot() {
      this.destroy = bind(this.destroy, this);
      this.render = bind(this.render, this);
      this.initialize = bind(this.initialize, this);
      return Spot.__super__.constructor.apply(this, arguments);
    }

    Spot.prototype.el = 'body';

    Spot.prototype.events = {
      'mouseover .seat': 'handle_hover',
      'mouseout .seat': 'handle_mouseout',
      'click .refine_layer li'  : "refine_results",
      'click .category' :  'category_switch'
    };

    Spot.prototype.initialize = function() {
      this.data = [
            {'value':'Aman','designation':'software-engineer','dept':'frontend','team':'supply'},
            {'value':'Raman','designation':'software-designer','dept':'design','team':'supply'},
            {'value':'Rita','designation':'product-manager','dept':'product-management','team':'supply'},
            {'value':'Sameera','designation':'senior-software-engineer','dept':'backend','team':'supply'},
            {'value':'Daman','designation':'software-engineer','dept':'backend','team':'buy'},
            {'value':'Chaman','designation':'senior-software-engineer','dept':'frontend','team':'buy'},
            {'value':'Chhavi','designation':'software-designer','dept':'design','team':'buy'},
            {'value':'Dipti','designation':'product-manager','dept':'product-management','team':'buy'},
            {'value':'Rahul','designation':'software-engineer','dept':'backend','team':'business'},
            {'value':'Mohit','designation':'senior-software-engineer','dept':'frontend','team':'business'},
            {'value':'Ankit','designation':'senior-product-manager','dept':'product-management','team':'business'},
            {'value':'Dhruv','designation':'software-designer','dept':'design','team':'business'},
            {'value':'Naman','designation':'senior-software-engineer','dept':'frontend','team':'rent'},
            {'value':'Madhvi','designation':'software-engineer','dept':'backend','team':'rent'},
            {'value':'Saurabh','designation':'product-manager','dept':'product-management','team':'rent'},
            {'value':'Gaurav','designation':'software-designer','dept':'design','team':'rent'},
            {'value':'Saurav','designation':'senior-software-engineer','dept':'backend','team':'search'},
            {'value':'Chitrak','designation':'senior-product-manager','dept':'product-management','team':'search'},
            {'value':'Chirag','designation':'software-engineer','dept':'frontend','team':'search'},
            {'value':'Neha','designation':'software-designer','dept':'design','team':'search'},
            {'value':'Sandy','designation':'software-designer','dept':'design','team':'tech_only'},
            {'value':'Simran','designation':'software-engineer','dept':'frontend','team':'tech_only'},
            {'value':'Sriram','designation':'senior-software-engineer','dept':'backend','team':'tech_only'},
            {'value':'manu','designation':'senior-software-engineer','dept':'product-management','team':'tech_only'}
          ]
      this.input=$('#newsLimit');
      var self = this;
      this.input.autocomplete({
        appendTo: ".input",
        source: self.data,
        select: self.select_name
      });
      this.render(this.data);
      $('.seat').draggable({
        start: function( event, ui ) {
          $(this).addClass('dragging')
          debugger
        },
        stop: function(event, ui){
          $(this).removeClass('dragging')
        }
      });  
      $( ".seat" ).droppable({
        drop: function( event, ui ) {
          $( this ).addClass( "dropped" ).removeClass('overing')
        },
        over:function (events,ui){
          $(this).addClass('overing')
        },
        out:function (events,ui){
          $(this).removeClass('overing')
        }
      });
    }

    Spot.prototype.render = function(data) {
      var counter={seat_count:0,right_seats:false}
      data.forEach(function(e,index){
        if(index%4==0){
          counter.seat_count=1;
        }
        $('.'+e.team).append('<div draggable="true" class="seat'+counter.seat_count+' seat"'+' data-name='+e.value+' data-designation='+e.designation+' data-dept='+e.dept+' data-team='+e.team+'></div>')
        if(counter.seat_count==2)
          $('.'+e.team).append('<div class="table"><div class="table_text">'+e.team+' Team</div></div>')
        counter.seat_count++;
      })
    };

    Spot.prototype.select_name = function(event,ui) {
      Spot.prototype.handle_hover({currentTarget:$('.seat[data-name='+ui.item.value+']')[0]})
    };

    Spot.prototype.refine_results = function(event) {
      debugger
      $('.hovered').removeClass('hovered')
      var text=$(event.currentTarget).children('span').text()
      var parent_class_array=event.currentTarget.parentElement.parentElement.classList
      if(Array(parent_class_array).join('').indexOf('team_container')!=-1)
        Spot.prototype.handle_hover({currentTarget:$('.seat[data-designation='+text.toLowerCase()+']')})
      else
        Spot.prototype.handle_hover({currentTarget:$('.seat[data-dept='+text.toLowerCase()+']')})
    };

    Spot.prototype.handle_hover = function(e) {
      if ($(e.currentTarget).length>1){
        $(e.currentTarget).each(function(index,el){
          el=$(el)
          if(el.find('.hover_layer').length)
            return el.addClass('hovered')
          else{
            var name=el[0].dataset.name;
            var designation=el[0].dataset.designation;
            var dept=el[0].dataset.dept;
            var team=el[0].dataset.team;
            var dp_class=el[0].dataset.name;
            var parent_cls = 'hover_layer';
            el.addClass('hovered').append('<div class="hover_container"><div class="'+parent_cls+'"><ul><li class="dpli">'+name+'<i class='+dp_class+'></i></li><li><span class="placeholder">Designation</span>'+designation+'</li><li><span class="placeholder">Department</span>'+dept+'</li><li class="spl_border"><span class="placeholder">Scrum Team</span>'+team+'</li></ul></div></div>')
          } 
        })
      }
      else{
        if($(e.currentTarget).find('.hover_layer').length)
        return $(e.currentTarget).addClass('hovered')
        var name=e.currentTarget.dataset.name;
        var designation=e.currentTarget.dataset.designation;
        var dept=e.currentTarget.dataset.dept;
        var team=e.currentTarget.dataset.team;
        var dp_class=e.currentTarget.dataset.name;
        var parent_cls = 'hover_layer';
        $(e.currentTarget).addClass('hovered').append('<div class="hover_container"><div class="'+parent_cls+'"><ul><li class="dpli">'+name+'<i class='+dp_class+'></i></li><li><span class="placeholder">Designation</span>'+designation+'</li><li><span class="placeholder">Department</span>'+dept+'</li><li class="spl_border"><span class="placeholder">Scrum Team</span>'+team+'</li></ul></div></div>')
      } 
    };

    Spot.prototype.handle_mouseout = function(e) {
        $(e.currentTarget).removeClass('hovered');
    };

    Spot.prototype.destroy = function() {
      this.stopListening();
      return this.$el.off().remove();
    };

    Spot.prototype.category_switch = function(e){
      target = e.currentTarget.dataset.target;
      $('.category').removeClass('selected')
      $(e.currentTarget).addClass('selected')
      $('.refine_params').removeClass('show').addClass('hide')
      $('.'+target).removeClass('hide').addClass('show')
    }

    Spot.prototype.detach_event = function(e_name) {
        debugger
        delete this.events[e_name]
        this.delegateEvents()
    };

    return Spot;

  })(Backbone.View);
  var init= new Spot();
});
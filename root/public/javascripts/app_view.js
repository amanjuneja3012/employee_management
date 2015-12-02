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
      debugger
      data=Spot.prototype.get_data();
    }

    Spot.prototype.get_data= function(){
      self=this;
      $.ajax({
        url: "/api/employees",
        }).done(function(data) {
          self.data=data;
          self.render(data);
          self.instantiate_draggable(data);
          self.input=$('#newsLimit');
          self.input.autocomplete({
              appendTo: ".input",
              source: data,
              select: self.select_name
          });
        });
      }

    Spot.prototype.instantiate_draggable = function(data) {
      var self = this;
      self.dragged_name = {}
      $('.seat').draggable({
        start: function( event, ui ) {
          $(this).addClass('dragging')
          self.dragged_name.element = this
          self.dragged_name.id = this.dataset.id
          self.dragged_name.top = this.style.top
          self.dragged_name.left = this.style.left
        },
        stop: function(event, ui){
          $(this).removeClass('dragging')
        }
      });  
      $( ".seat" ).droppable({
        drop: function( event, ui ) {
          $( this ).addClass( "dropped" ).removeClass('overing')
          $('.notification').hide()
          event.stopPropagation()
          var a = Spot.prototype.get_index(self.dragged_name.id,data)
          var b = Spot.prototype.get_index(this.dataset.id,data)
          Spot.prototype.swap_members({
            'array':data,
            'a':a,
            'b':b
          })
          Spot.prototype.render(data);
          Spot.prototype.instantiate_draggable(data);
        },
        over:function (events,ui){
          $(this).addClass('overing')
          $('.notification').show()
        },
        out:function (events,ui){
          $(this).removeClass('overing')
        }
      });
      $('body').droppable({
        drop:function(event, ui){
          if(self.dragged_name.hasOwnProperty('element')){
            self.dragged_name.element.style.top = self.dragged_name.top
            self.dragged_name.element.style.left = self.dragged_name.left
          }
        }
      })
    };

    Spot.prototype.render = function(data) {
      $('.cluster').html('')
      var counter={seat_count:0,right_seats:false}
      data.forEach(function(e,index){
        if(index%4==0){
          counter.seat_count=1;
        }
        $('.'+e.team).append('<div draggable="true" class="seat'+counter.seat_count+' seat"'+' data-name='+e.value+' data-designation='+e.designation+' data-dept='+e.dept+' data-team='+e.team+' data-id='+ e.id+'></div>')
        if(counter.seat_count==2)
          $('.'+e.team).append('<div class="table"><div class="table_text">'+e.team+' Team</div></div>')
        counter.seat_count++;
      })
    };

    Spot.prototype.select_name = function(event,ui) {
      Spot.prototype.handle_hover({currentTarget:$('.seat[data-name='+ui.item.value+']')[0]})
    };

    Spot.prototype.get_index = function(id,array){
      var self=this;
      $.map(array, function(obj, index) {
        if(obj.id == id) {
          self.target_index=index;
        }
      })
      return self.target_index;
    }

    Spot.prototype.swap_members = function(obj) {
      var tmp=obj.array[obj.a];
      obj.array[obj.a]=obj.array[obj.b];
      obj.array[obj.b]=tmp;
    };

    Spot.prototype.refine_results = function(event) {
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
        delete this.events[e_name]
        this.delegateEvents()
    };

    return Spot;

  })(Backbone.View);
  var init= new Spot();
});
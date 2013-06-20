$(function() {
    /*
  Left pad to leading zero's for values < 10
  http://stackoverflow.com/questions/10632346/how-to-format-a-date-in-mm-dd-yyyy-hhmmss-format-in-javascript#answer-10632399
 */
Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
};

function Event(data){
    $.extend(this, data);
    this.render = function(){
        var html = "<div>";
        html += "<h4>"+ this.name +"</h4>";
        html += "<ul>";
        html += "<li><b>Data:</b> " + this.getDate() + "</li>";
        if (this.getTime() !== "00:00") {
            html += "<li><b>Horário:</b> " + this.getTime() + "</li>";
        }

        html += "<li><b>Local:</b> "+ this.getLocal() +"</li>";

        if (typeof this.technology !== 'undefined') {
            html += "<li><b>Linguagem:</b> "+ this.technology +"</li>";
        };

        if(typeof this.getTags() != 'undefined'){
            html += "<li><b>Tags:</b> "+ this.getTags() +"</li>";
        }


        html += "</ul>";
        html += "Informações e inscrições: " + this.getRegistration();
        html += "</div><hr />";

        return html;
    };
    this.getDate = function(){
        /* Return date in dd-mm-yyyy format */
        var d = new Date(this.date);
        return [d.getDate(), d.getMonth()+1, d.getFullYear()].join('/');
    };
    this.getTime = function(){
        /* Return time in hh:ss format */
        var d = new Date(this.date);
        return [d.getHours().padLeft(), d.getMinutes().padLeft()].join(':');
    };
    this.getTags = function(){
        return this.tags;
    };
    this.getLocal = function(){
        var local = [];
        if (typeof this.local.url !== 'undefined') {
            local.push('<a href="'+ this.local.url +'">'+ this.local.name +'</a>');
        }else if(typeof this.local.name !== 'undefined'){
            local.push(this.local.name);
        }else{
            return this.local.address;
        }
        local.push(this.local.address);

        return local.join(", ");
    };
    this.getRegistration = function(){
        if (typeof this.registration.url == 'undefined') {
            return this.registration.name;
        }
        return '<a href="'+this.registration.url+'">'+this.registration.name+'</a>';
    };
}

function EventList(){
    this.render = function(){
        var html = "";
        this.forEach(function(e, index, array){
            html += e.render();
        });
        return html;
    };
}
EventList.prototype = new Array();

var eventList = new EventList();

$.getJSON('../events.json', function(data) {
    console.log(data);
    $.each(data.events, function(i, e){
        eventList.push(new Event(e));
    });

    $(eventList.render()).appendTo('#main_content');
    console.log(eventList.render());
});


});
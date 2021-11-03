// Backbone Model

var Blog = Backbone.Model.extend({
    defaults: {
        author: "",
        title: "",
        url: ""
    }
});

// Backbone Collection

var Blogs = Backbone.Collection.extend({});

// instantiate two Blogs

/* var blog1 = new Blog({
    author: "Michael",
    title: "Michael\'s Blog",
    url: "http://michaelsblog.com"
});

var blog2 = new Blog({
    author: "John",
    title: "John\'s Blog",
    url: "http://johnsblog.com"
}) */

// instantiate a Collection

var blogs = new Blogs();

// Backbone View for one blog

var BlogView = Backbone.View.extend({
    model: new Blog(), 
    tagName: "tr",
    initialize: function() {
        this.template = _.template($(".blogs-list-template").html());
    },

    events: {
        "click .edit-blog": "edit", //if we click on .edit-blog, the edit function will run
        "click .update-blog": "update",
        "click .cancel-blog": "cancel",
        "click .delete-blog": "delete"
    },
    edit: function() { 
        //when this runs, the edit and delete buttons will be hidden and the update and cancel buttons will be schown
        $(".edit-blog").hide();
        $(".delete-blog").hide();
        this.$(".update-blog").show(); //we add this here because otherwise, every button for every blog will be changed to update and cancel (try it without this)
        this.$(".cancel-blog").show();

        //stores the values
        var author = this.$('.author').html();
        var title = this.$('.title').html();
        var url = this.$('.url').html();

        //to get a textbox to edit the text
        this.$('.author').html('<input type="text" class="form-control author-update" value="' + author + '">');
        this.$('.title').html('<input type="text" class="form-control title-update" value="' + title + '">');
        this.$('.url').html('<input type="text" class="form-control url-update" value="' + url + '">');
    },

    update: function() { //set the value of the edit input boxes to the new values of the block model
        this.model.set("author", $(".author-update").val());
        this.model.set("title", $(".title-update").val());
        this.model.set("url", $(".url-update").val());
    },

    cancel: function() {
        blogsView.render();
    },

    delete: function() {
        this.model.destroy();
    },

    //to render the page
    render: function() {
        this.$el.html(this.template(this.model.toJSON()))
        return this;
    }
});

// Backbone View for all blogs

var BlogsView = Backbone.View.extend({
    model: blogs, 
    el: $(".blogs-list"),
    initialize: function() {
        var self = this; //we need to do this because this doesnt work in setTimeout
        this.model.on("add", this.render, this);
        this.model.on("change", function() { //we create a new function here to set a time because otherwise the changes from the update function above is cancelled to quickly and the changes from title and url wont be registered
            setTimeout(function() {
                self.render();
            }, 30);
        }, this);
        this.model.on("remove", this.render, this); //Like that BlogsView listens to a removal of an item otherwise it wouldnt be removed
    },

    render: function() {
        var self = this;
        this.$el.html("");
        _.each(this.model.toArray(), function(blog){
            self.$el.append((new BlogView({model: blog})).render().$el);
        });
        return this;
    }
});

var blogsView = new BlogsView();

$(document).ready(function() {
    $(".add-blog").on("click", function() {
        var blog = new Blog({
            author: $(".author-input").val(),
            title: $(".title-input").val(),
            url: $(".url-input").val()
        });
        $(".author-input").val(""); //the following three lines clear the input to the text fields after we added a new blogger
        $(".title-input").val("");
        $(".url-input").val("");
        //console.log(blog.toJSON());
        blogs.add(blog);
    })
})
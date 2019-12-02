/* Todo:
comment streams should use "comment" as event;
There should be a stream for both submissions and comments */

const snoowrap = require("snoowrap"),
events = require("events");

class foo extends snoowrap {
    constructor(config) {
        super(config);
        //Collection of streams
        this.streams = new Map();
        this.streams.lastKey = -1;

        //Shortcuts
        this.submissionStream = options => this.createStream(options, 'submission');
        this.commentStream = options => this.createStream(options, 'comment');
        
    }

    createStream(options, type) {
        options = options || {};
        options.sub = options.sub || ['all'];
        options.rate = options.rate || 2000;
    
        let event = new events.EventEmitter();
        this.streams.lastKey++;
        let id = this.streams.lastKey;
        
        let stream = new foostream(this, id, event, type, options);
        this.streams.set(this.streams.lastKey, stream);
    
        return event
    }
}

class foostream {
    constructor(snoowrap, id, event, type, options) {
        this.type = type;
        this.id = id;
        this.rate = options.rate;
        this.sub = options.sub;

        const previousResults = {};

        const search = () =>
            this.sub.forEach(sub => {
                if (!previousResults[sub])
                    previousResults[sub] = [];
                
                function read(listing) {
                    let newResults = [];
                    for (let i=0; i < listing.length; i++) {
                        if (!previousResults[sub].find((x) => {return x.id === listing[i].id}))
                        newResults.push(listing[i]);
                    }
                    
                    if (newResults.length > 0)
                        newResults.forEach(result => event.emit('post', result));
                    
                    previousResults[sub] = listing;
                }
    
                if (this.type === "submission")
                    snoowrap.getSubreddit(sub).getNew().then(read);
                if (this.type === "comment")
                    snoowrap.getSubreddit(sub).getNewComments().then(read);
            });

        search() //Launch immediately once
        setInterval(search, this.rate)
    }

    destroy() {
        snoowrap.streams.delete(this.id);
    }

    addSub(sub){
        this.sub.push(sub);
    }

    //Who knows if this works
    removeSub(sub){
        let index = this.sub.indexOf(sub);
        this.sub.splice(index, 1);
    }
}

module.exports = foo;

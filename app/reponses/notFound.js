

module.exports = function *notFound (next){
        yield* next;
        console.log(this.status);
        if (404 != this.status) return;

        this.status = 404;

        switch (this.accepts('html', 'json')) {
            case 'html':
            this.type = 'html';
            this.body = '<p>Page Not Found</p>';
            break;
            case 'json':
            this.body = {
                message: 'Page Not Found'
            };
            break;
            default:
            this.type = 'text';
            this.body = 'Page Not Found';
        }
};


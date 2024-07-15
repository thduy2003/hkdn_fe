
export class SearchParams {
    id?: number;
    page?: number;
    limit?: number;
    sort?: string;
    selectFields?: string;
    keyword?: string;
    include?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;

    /**
     * Specify additional queries to call search API along with
     * some standard queries such as page, limit
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    additionalQueries?: Map<string, any>;

    constructor(options: {
        id?: number,
        page?: number,
        limit?: number,
        sort?: string,
        selectFields?: string,
        include?: string,
        keyword?: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        additionalQueries?: Map<string, any>
    } = {}) {
        this.id = options.id || new Date().getTime();
        this.page = options.page || 1;
        this.limit = options.limit || 10;
        this.sort = options.sort;
        this.selectFields = options.selectFields;
        this.keyword = options.keyword;
        this.include = options.include;
        this.additionalQueries = options.additionalQueries;
    }

    /**
     * Build the URLSearchParams based on search options
     * @return {Array}
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toSearchParams(): any {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let params = new Map<string, any>()

        if (this.additionalQueries) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.additionalQueries.forEach((value: any, key: string) => {
                if (value) {
                    params = params.set(key, value);
                }
            });
        }

        if (this.sort) {
            params = params.set('sort', this.sort);
        }

        if (this.selectFields) {
            params = params.set('fields', this.selectFields);
        }

        if (this.keyword) {
            params = params.set('keyword', this.keyword);
        }

        if (this.include) {
            params = params.set('include', this.include);
        }

        if (this.page) {
            params = params.set('page', this.page.toString());
        }

        if (this.limit) {
            params = params.set('limit', this.limit.toString());
        }

        return params;
    }
}

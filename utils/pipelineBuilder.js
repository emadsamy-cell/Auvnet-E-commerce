class pipelineBuilder {
    constructor() {
        this.pipeline = [];
    }

    match(filter) {
        this.pipeline.push({ $match: filter });
        return this;
    }

    lookup(from, localField, foreignField, as) {
        this.pipeline.push({ $lookup: { from, localField, foreignField, as } });
        return this;
    }

    unwind(path) {
        this.pipeline.push({ $unwind: path });
        return this;
    }

    sort(sort) {
        this.pipeline.push({ $sort: sort });
        return this;
    }

    skip(skip) {
        this.pipeline.push({ $skip: skip });
        return this;
    }

    limit(limit) {
        this.pipeline.push({ $limit: limit });
        return this;
    }

    project(project) {
        this.pipeline.push({ $project: project });
        return this;
    }

    group(group) {
        this.pipeline.push({ $group: group });
        return this;
    }

    facet(facet) {
        this.pipeline.push({ $facet: facet });
        return this;
    }
    
    build() {
        return this.pipeline;
    }
}

module.exports = pipelineBuilder;

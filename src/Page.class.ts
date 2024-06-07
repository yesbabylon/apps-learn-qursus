import {$} from "./jquery-lib";
import {LeafClass} from "./Leaf.class";
import {DomainClass} from "./Domain.class";
import {ChapterClass} from "./Chapter.class";
import {ApiService} from "./qursus-services";


/**
 *
 */
export class PageClass {
    // allow virtual keys for dynamic assignment after API updates (we make sure to only use keys defined below)
    [key: string]: any;

    public id: number;
    public identifier: number;
    public order: number;
    public leaves: LeafClass[];
    public type: string;               //'basic', 'chapter_select'
    public next_active: [];            // domain
    public selection: number;

    private readonly $container: JQuery;
    private parent: ChapterClass;

    // page-specific context
    private context: any = {
        actions_counter: 0,
        selection: 0,
        submitted: false,
        mode: 'view'
    };

    constructor(
        id: number = 0,
        identifier: number = 1,
        order: number = 1,
        leaves: LeafClass[] = [],
        type: string,               //'basic', 'chapter_select'
        next_active: [],            // domain
    ) {
        this.id = id;
        this.identifier = identifier;
        this.order = order;
        this.leaves = leaves;
        this.type = type;
        this.next_active = next_active;
        this.selection = 0;

        if (this.next_active && !Array.isArray(this.next_active)) {
            this.next_active = JSON.parse((<string>this.next_active).replace(/'/g, '"'));
        }

        this.$container = $('<div id="page-container" class="page"></div>');
    }

    public setParent(parent: ChapterClass): void {
        this.parent = parent;
    }

    public getParent(): ChapterClass {
        return this.parent;
    }

    public getContainer() {
        return this.$container;
    }

    public setContext(context: any) {
        for (let key of Object.keys(this.context)) {
            if (context.hasOwnProperty(key)) {
                this.context[key] = context[key];
            }
        }
    }

    public render(context: any) {
        console.log("PageClass::render", this);

//        this.setContext(context);

        let is_single = true;

        if (this.leaves && this.leaves.length) {
            is_single = (this.leaves.length < 2);
            for (let index in this.leaves) {

                let item = this.leaves[index];

                let leaf: LeafClass = new LeafClass(
                    item.id,
                    item.identifier,
                    item.order,
                    item.groups,
                    item.visible,
                    item.background_image,
                    item.background_opacity,
                    item.background_stretch,
                    item.contrast
                );

                this.leaves[index] = leaf;
                leaf.setParent(this);

                if (context.mode == 'edit') {
                    leaf.setContext({mode: 'edit'});
                }

                // update a context param object with instance context
                for (let elem of Object.keys(this.context)) {
                    context['$page.' + elem] = this.context[elem];
                }

                this.$container.append(leaf.render(is_single, context));

                if (this.next_active && !this.next_active.length) {
                    this.parent.propagateContextChange({'$module.next_active': true});
                }
            }
        }
        $('body').find('.section-container.viewport-container').remove();

        // reset section-nav buttons (hide)
        // $('body').find('.section-nav').hide();

        if (context.mode == 'edit') {
            /*
             append controls to module container
            */
            // remove any previously rendered controls
            this.parent.getParent().getContainer().find('.controls.page-controls').remove();

            let $page_controls = $('<div class="controls page-controls"><div class="label">Page ' + this.identifier + '</div></div>');
            let $page_actions = $('<div class="actions page-actions"></div>');
            let $page_edit_button = $('<div class="action-button page-edit-button" title="Edit Page"><span class="material-icons mdc-fab__icon">mode_edit</span></div>');
            let $page_add_button = $('<div class="action-button page-add-button" title="Add a Leaf"><span class="material-icons mdc-fab__icon">add</span></div>');
            let $page_delete_button = $('<div class="action-button page-delete-button" title="Delete Page"><span class="material-icons mdc-fab__icon">delete</span></div>');

            $page_actions.append($page_edit_button);
            $page_actions.append($page_add_button);
            $page_actions.append($page_delete_button);
            $page_controls.append($page_actions);
            $page_controls.appendTo(this.parent.getParent().getContainer());

            /*
             setup action handlers
            */
            $page_edit_button.on('click', () => {
                window.eq.popup({
                    entity: 'learn\\Page',
                    type: 'form',
                    mode: 'edit',
                    domain: ['id', '=', this.id],
                    callback: (data: any) => {
                        if (data && data.objects) {
                            for (let object of data.objects) {
                                if (object.id != this.id) continue;
                                for (let field of Object.keys(this)) {
                                    if (object.hasOwnProperty(field)) {
                                        this[field] = (this[field]) ? ((this[field].constructor)(object[field])) : object[field];
                                    }
                                }
                            }
                            // request refresh for current context
                            this.parent.propagateContextChange({refresh: true});
                        }
                    }
                });
            });

            $page_add_button.on('click', () => {
                let leaf_identifier = (this.leaves) ? this.leaves.length + 1 : 1;
                window.eq.popup({
                    entity: 'learn\\Leaf',
                    type: 'form',
                    mode: 'edit',
                    purpose: 'create',
                    domain: [['page_id', '=', this.id], ['identifier', '=', leaf_identifier], ['order', '=', leaf_identifier]],
                    callback: (data: any) => {
                        // append new page to chapter
                        if (data && data.objects) {
                            for (let item of data.objects) {
                                let leaf = new LeafClass(
                                    Number(item.id),
                                    Number(item.identifier),
                                    Number(item.order),
                                    item.groups,
                                    item.visible,
                                    item.background_image,
                                    item.background_opacity,
                                    item.background_stretch,
                                    item.contrast
                                );
                                if (!this.leaves) {
                                    this.leaves = new Array<LeafClass>();
                                }
                                this.leaves.push(leaf);
                            }
                            this.propagateContextChange({refresh: true});
                        }
                    }
                });
            });

            $page_delete_button.on('click', () => {
                if (window.confirm("Page is about to be removed. Do you confirm ?")) {
                    this.parent.getParent().getContainer().find('.controls.page-controls').remove();
                    ApiService.update('learn\\Chapter', [this.parent.id], {'pages_ids': [this.id]}, true);
                    this.parent.propagateContextChange({'$chapter.remove_page': this.id, refresh: true});
                }
            });
        }
        return this.$container;
    }

    /**
     * Changes received from children
     * @param contextChange
     */
    public propagateContextChange(contextChange: any) {
        console.log('Page::propagateContext', contextChange);

        for (let elem of Object.keys(contextChange)) {
            if (elem.indexOf('$page') == 0) {
                let value = contextChange[elem];
                const parts = elem.split('.');
                if (parts.length > 1) {
                    if (parts[1] == 'actions_counter') {
                        ++this.context[parts[1]];
                        contextChange[elem] = this.context[parts[1]];
                        // relay counter to parent leaf
                        contextChange['$chapter.actions_counter'] = value;
                    } else if (parts[1] == 'remove_leaf' && this.leaves && this.leaves.length) {
                        // value is widget id
                        for (const [index, leaf] of this.leaves.entries()) {
                            if (leaf.id == value) {
                                this.leaves.splice(index, 1);
                            }
                        }
                    } else {
                        this.context[parts[1]] = value;
                    }
                    if (this.next_active) {
                        let domain = new DomainClass(this.next_active);
                        let next_active = domain.evaluate(contextChange);
                        if (next_active) {
                            contextChange['$module.next_active'] = true;
                        }
                    }
                }

            }
        }

        this.parent.propagateContextChange(contextChange);
    }

    /**
     * Changes received from parent
     * @param contextChange
     */
    public onContextChange(contextChange: any) {
        console.log('Page::onContextChange', contextChange);

        for (let elem of Object.keys(contextChange)) {
            if (elem.indexOf('$chapter.mode') == 0) {
                this.context.mode = contextChange[elem];
            }
        }

        // update contextChange object with instance context
        for (let elem of Object.keys(this.context)) {
            contextChange['$page.' + elem] = this.context[elem];
        }

        // relay contextChange to children
        if (this.leaves && this.leaves.length) {
            for (let leaf of this.leaves) {
                if (typeof leaf.onContextChange === 'function') {
                    leaf.onContextChange(contextChange);
                }
            }
        }
    }
}

export default PageClass;
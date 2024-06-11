import $ from 'jquery';


export interface Prop {
    readonly name: string;
}

export interface Leaf extends Prop {
    readonly name: 'Leaf';
    order: number;
}

export interface Group extends Prop {
    readonly name: 'Group';
    leaf: Leaf;
    order: number;
}

export interface Widget extends Prop {
    readonly name: 'Widget'
    group: Group;
    order: number;
}

export type TypeProps = Widget | Group | Leaf;
export type PopoverType = 'Widget' | 'Group' | 'Leaf';


/**
 * Create a popover element based on the given Qursus type and link it to the given HTMLElement.
 *
 * @param type The type of the Qursus element.
 * @param props The wanted properties of the Qursus element.
 * @param element The HTMLElement to link the popover to.
 */
const popover = (type: PopoverType, props: TypeProps, element: JQuery<HTMLElement>): void => {
    if (!element.hasClass('actions')) {
        return;
    }

    /**
     * Function for adding the properties to the popover
     * @param props
     */
    const addLines = (props: TypeProps): void => {
        for (const [key, value] of Object.entries(props)) {
            if (typeof value === 'object') {
                addLines(value);
            } else if (key !== 'name') {
                let $popover_prop = $('<div class="popover__content__prop"></div>');
                // get the name of the union type object

                let $popover_prop_label = $('<span class="popover__content__props__label"></span>')
                    .text(props.name + ' ' + key + ' : ');

                let $popover_prop_value = $('<span class="popover__content_props__value"></span>')
                    .text(props.order);

                $popover_prop.append($popover_prop_label, $popover_prop_value);
                $popover_content.append($popover_prop);
            }
        }
    }

    let $popover = $('<div class="popover" popover></div>')
    let $popover_header = $('<span class="popover__header"></span>');
    let $popover_content = $('<div class="popover__content"></div>');

    // Add the title to the popover
    $popover_header.text(type);

    // Add the properties to the popover content
    addLines(props);

    // Append the header and content to the popover
    $popover.append($popover_header, $popover_content);

    // Add the popover to the element
    element.append($popover);

    // Toggle the popover on hover
    element.on('mouseenter', (): void => {
        console.log('popover event works')
        console.log(props)

        const $screen_width: number = $(window).width();
        let $popover_position_left: number;
        if ($screen_width / 2 < element.offset().left) {
            $popover_position_left = element.width() - $popover.width();
        } else {
            $popover_position_left = element.width() + $popover.width();
        }

        $popover
            .css('display', 'flex')
            .css('top', element.height() - $popover.height() + 10)
            .css('left', $popover_position_left);
    }).on('mouseleave', (): void => {
        $popover.css('display', 'none');
    });
}

export default popover;
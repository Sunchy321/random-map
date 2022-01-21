import { generate } from 'peggy';
import syntax from './logic-syntax.pegjs';

export type Logic = { type: 'and' | 'or', expr: Logic[] } | { type: 'term', expr: string };

export type LogicValue = boolean | undefined;

export type EvaluatedLogic =
    { type: 'and' | 'or', expr: EvaluatedLogic[], value?: boolean } |
    { type: 'term', expr: string, value?: boolean };

const parser = generate(syntax);

export function parseLogic(text: string): Logic {
    try {
        return parser.parse(text.trim());
    } catch (e: any) {
        console.error(`Text: ${text}`);
        throw e;
    }
}

export function term(expr: string, value?: boolean): EvaluatedLogic {
    return { type: 'term', expr, value };
}

export function and(expr: (EvaluatedLogic | string)[], value?: boolean): EvaluatedLogic {
    const evaluatedExpr = expr.map(e => (typeof e === 'string' ? term(e, undefined) : e));

    if (evaluatedExpr.length === 0) {
        return { type: 'and', expr: [], value: true };
    }

    if (evaluatedExpr.length === 1) {
        return evaluatedExpr[0];
    }

    if (value !== undefined) {
        return { type: 'and', expr: evaluatedExpr, value };
    }

    if (evaluatedExpr.some(e => e.value === false)) {
        return { type: 'and', expr: evaluatedExpr, value: false };
    }

    if (evaluatedExpr.every(e => e.value === true)) {
        return { type: 'and', expr: evaluatedExpr, value: true };
    }

    return { type: 'and', expr: evaluatedExpr, value: undefined };
}

export function or(expr: (EvaluatedLogic | string)[], value?: LogicValue): EvaluatedLogic {
    const evaluatedExpr = expr.map(e => (typeof e === 'string' ? term(e, undefined) : e));

    if (evaluatedExpr.length === 0) {
        return { type: 'or', expr: [], value: false };
    }

    if (evaluatedExpr.length === 1) {
        return evaluatedExpr[0];
    }

    if (value !== undefined) {
        return { type: 'or', expr: evaluatedExpr, value };
    }

    if (evaluatedExpr.some(e => e.value === true)) {
        return { type: 'or', expr: evaluatedExpr, value: true };
    }

    if (evaluatedExpr.every(e => e.value === false)) {
        return { type: 'or', expr: evaluatedExpr, value: false };
    }

    return { type: 'or', expr: evaluatedExpr, value: undefined };
}

export type StringifyConfig = {
    isTopLevel?: boolean;
    transform?: (text: string) => string;
};

export function stringifyLogic(logic: Logic, config?: StringifyConfig): string {
    const isTopLevel = config?.isTopLevel ?? false;
    const transform = config?.transform ?? (t => t);

    if (logic.type === 'term') {
        return transform(logic.expr);
    } else {
        const separator = logic.type === 'and' ? ' + ' : ' | ';

        const text = logic.expr.map(e => stringifyLogic(e, { transform })).join(separator);

        if (isTopLevel) {
            return text;
        } else {
            return `(${text})`;
        }
    }
}

export type PrintConfig = {
    isTopLevel?: boolean;
    transform?: (text: string) => string;
};

export function printLogic(
    logic: EvaluatedLogic,
    config?: PrintConfig,
): string {
    const isTopLevel = config?.isTopLevel ?? false;
    const transform = config?.transform ?? (t => t);

    if (logic.type === 'term') {
        const text = transform(logic.expr);

        if (logic.value == null) {
            return text;
        } else {
            return `<span class="logic-value ${logic.value}">${text}</span>`;
        }
    } else {
        const separator = logic.type === 'and' ? ' + ' : ' | ';

        if (logic.value == null) {
            const text = logic.expr.map(e => printLogic(e, { transform })).join(separator);

            if (isTopLevel) {
                return text;
            } else {
                return `(${text})`;
            }
        } else {
            const innerHtmls = logic.expr.map(e => {
                const text = stringifyLogic(e, { transform });

                if (logic.type === 'and' && logic.value === false && e.value === false) {
                    return `<span class="logic-value highlight">${text}</span>`;
                }

                if (logic.type === 'or' && logic.value === true && e.value === true) {
                    return `<span class="logic-value highlight">${text}</span>`;
                }

                return text;
            });

            if (isTopLevel) {
                return `<span class="logic-value ${logic.value}">(${innerHtmls.join(separator)})</span>`;
            } else {
                return `<span class="logic-value ${logic.value}">(${innerHtmls.join(separator)})</span>`;
            }
        }
    }
}

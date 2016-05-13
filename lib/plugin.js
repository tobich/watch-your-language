// Applying __validate__() on callee causes it to lose 'this'.
// There are two ways around it:
// 1. Don't wrap callee in __validate__() (current method)
// 2. Transform all direct function calls to fn.call() with proper scope
function isCallee(path) {
    return path.parentPath.isCallExpression() && path.parentPath.node.callee === path.node;
}

// Wrap every single expression (except callee, see above) in __validate__()
module.exports = function (babel) {
    const t = babel.types;
    return {
        visitor: {
            Expression: {
                exit(path) {
                    if(!isCallee(path)) {

                        // As our CallExpression is an expression as well, we have to skip it,
                        // in order to prevent infinite recursion.
                        path.skip();
                        
                        path.replaceWith(
                            t.CallExpression(
                                t.Identifier('__validate__'),
                                [ path.node ]
                            )
                        );
                    }
                }
            }
        }
    }
};
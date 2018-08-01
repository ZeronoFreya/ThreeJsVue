
function pathJoin(root, ...args) {
    function getIdx(arg) {
        let beginChar, endChar = '';
        let start, end, len = 0;
        len = arg.length;
        beginChar = arg.charAt(0);
        endChar = arg.charAt(len - 1);
        start = beginChar == '/' ? 1 : 0;
        end = endChar == '/' ? len - 1 : len;
        return [start, end];
    }

    let p = [];
    let arg = root.replace(/\\/g, '/');
    let idxs = getIdx(arg);
    p.push(arg.substring(0, idxs[1]));
    for (let i = 0, il = args.length; i < il; i++) {
        arg = args[i].replace(/\\/g, '/');
        idxs = getIdx(arg);
        p.push(arg.substring(idxs[0], idxs[1]));
    }
    return p.join('/');
}
export { pathJoin }
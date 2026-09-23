; Keywords
"load" @keyword
"include" @keyword
"macro" @keyword
"func" @keyword
"fespace" @type.builtin
"problem" @type.builtin
"solve" @type.builtin
"varf" @type.builtin
"border" @type.builtin

"if" @keyword
"else" @keyword
"for" @keyword
"while" @keyword
"return" @keyword
"break" @keyword
"continue" @keyword
"try" @keyword
"catch" @keyword

; Types
(primitive_type) @type.builtin
(array_type) @type.builtin

(type
  (identifier) @type)

(fespace_declaration
  name: (identifier) @type)

; Declarations
(function_definition
  name: (identifier) @function)

(macro_definition
  name: (identifier) @function.macro)

(problem_declaration
  name: (identifier) @function)

(varf_declaration
  name: (identifier) @function)

(border_declaration
  name: (identifier) @function)

(parameter
  name: (identifier) @variable.parameter)

(declarator
  name: (identifier) @variable)

; Special Variables & Coordinates
((identifier) @variable.special
 (#match? @variable.special "^(x|y|z|label|region|area|volume|BoundaryEdge|edgeOrientation|hTriangle|InternalEdge|lenEdge|nTonEdge|nuEdge|nuTriangle|N|P|ARGV|version|verbosity|mpirank|mpisize|mpiCommWorld)$"))

; Special Constants
(special_constant) @constant.builtin

; Built-in Functions & PDE Operators
((identifier) @function.builtin
 (#match? @function.builtin "^(int1d|int2d|int3d|on|dx|dy|dz|dxx|dyy|dzz|dxy|dxz|dyz|dyx|dzx|dzy|EigenValue|complexEigenValue|abs|acos|acosh|asin|asinh|atan|atan2|atanh|atof|atoi|ceil|imag|cos|cosh|conj|sin|sinh|max|mean|min|tan|tanh|sqrt|exp|log|log10|pow|adaptmesh|gmshload|gmshload3|buildmesh|square|square3|readmesh|readmesh3|cube|movemesh|movemesh23|mpiAlltoall|mpiAlltoallv|mpiAllgather|mpiAllgatherv|mpiAllReduce|mpiBarrier|mpiGather|mpiGatherv|mpiReduce|mpiScatter|mpiScatterv|mpiSize|mpiWait|mpiWaitAny|mpiWtick|mpiWtime|mpiRank|clock|plot|getARGV|cout|cin|endl)$"))

; Function calls
(call_expression
  function: (identifier) @function)

(call_expression
  function: (member_expression
    property: (identifier) @function))

; Member access
(member_expression
  property: (identifier) @property)

; Literals
(number) @number
(string) @string
(escape_sequence) @string.escape
(boolean) @boolean
(comment) @comment

; Operators
[
  "="
  "+="
  "-="
  "*="
  "/="
  "%="
  "^="
  "&="
  "|="
  "<<="
  ">>="
  "+"
  "-"
  "*"
  "/"
  "%"
  "++"
  "--"
  "=="
  "!="
  "<"
  "<="
  ">"
  ">="
  "&&"
  "||"
  "!"
  "~"
  "&"
  "|"
  "^"
  "<<"
  ">>"
  "?"
  ":"
] @operator

; Punctuation
[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

[
  ";"
  ","
  "."
] @punctuation.delimiter

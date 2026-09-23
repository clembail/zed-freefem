const PREC = {
  COMMENT: 1,
  ASSIGN: 2,
  TERNARY: 3,
  LOGICAL_OR: 4,
  LOGICAL_AND: 5,
  BITWISE_OR: 6,
  BITWISE_XOR: 7,
  BITWISE_AND: 8,
  EQUALITY: 9,
  RELATIONAL: 10,
  SHIFT: 11,
  ADD: 12,
  MULTIPLY: 13,
  UNARY: 14,
  UPDATE: 15,
  CALL: 16,
  SUBSCRIPT: 17,
  MEMBER: 18,
};

module.exports = grammar({
  name: 'freefem',

  extras: $ => [
    /\s/,
    $.comment,
  ],

  conflicts: $ => [
    [$.load_statement],
    [$.include_statement],
    [$.parameter, $._expression],
  ],

  rules: {
    source_file: $ => repeat($._statement),

    _statement: $ => choice(
      $.load_statement,
      $.include_statement,
      $.macro_definition,
      $.function_definition,
      $.fespace_declaration,
      $.problem_declaration,
      $.varf_declaration,
      $.border_declaration,
      $.variable_declaration,
      $.compound_statement,
      $.if_statement,
      $.while_statement,
      $.for_statement,
      $.return_statement,
      $.break_statement,
      $.continue_statement,
      $.try_statement,
      $.expression_statement,
      $.empty_statement,
    ),

    empty_statement: $ => ';',

    // Directives
    load_statement: $ => seq('load', field('library', $.string), optional(';')),
    include_statement: $ => seq('include', field('file', $.string), optional(';')),

    // Macros: FreeFEM macros end with //
    macro_definition: $ => seq(
      'macro',
      field('name', $.identifier),
      optional(field('parameters', $.parameter_list)),
      field('body', repeat(choice(
        $._expression,
        ';',
        ',',
        '{',
        '}',
      ))),
      '//'
    ),

    // Declarations
    fespace_declaration: $ => seq(
      'fespace',
      field('name', $.identifier),
      '(',
      optional($.argument_list),
      ')',
      ';'
    ),

    problem_declaration: $ => seq(
      choice('problem', 'solve'),
      field('name', $.identifier),
      '(',
      optional($.argument_list),
      ')',
      '=',
      field('formulation', $._expression),
      ';'
    ),

    varf_declaration: $ => seq(
      'varf',
      field('name', $.identifier),
      '(',
      optional($.argument_list),
      ')',
      '=',
      field('formulation', $._expression),
      ';'
    ),

    border_declaration: $ => seq(
      'border',
      field('name', $.identifier),
      '(',
      optional($.argument_list),
      ')',
      field('body', $.compound_statement)
    ),

    function_definition: $ => choice(
      seq(
        'func',
        optional(field('return_type', $.type)),
        field('name', $.identifier),
        field('parameters', $.parameter_list),
        field('body', $.compound_statement)
      ),
      seq(
        'func',
        optional(field('return_type', $.type)),
        field('name', $.identifier),
        '=',
        field('body', $._expression),
        ';'
      )
    ),

    variable_declaration: $ => seq(
      field('type', $.type),
      commaSep1($.declarator),
      ';'
    ),

    declarator: $ => seq(
      field('name', $.identifier),
      optional(choice(
        seq('=', field('value', $._expression)),
        seq('(', optional($.argument_list), ')'),
        seq('[', optional($.argument_list), ']')
      ))
    ),

    parameter_list: $ => seq(
      '(',
      commaSep($.parameter),
      ')'
    ),

    parameter: $ => choice(
      seq(optional(field('type', $.type)), field('name', $.identifier), optional(seq('=', field('default', $._expression)))),
      field('name', $.identifier)
    ),

    // Control flow
    compound_statement: $ => seq(
      '{',
      repeat($._statement),
      '}'
    ),

    if_statement: $ => prec.right(seq(
      'if',
      '(',
      field('condition', $._expression),
      ')',
      field('consequence', $._statement),
      optional(seq('else', field('alternative', $._statement)))
    )),

    while_statement: $ => seq(
      'while',
      '(',
      field('condition', $._expression),
      ')',
      field('body', $._statement)
    ),

    for_statement: $ => seq(
      'for',
      '(',
      field('initializer', choice(
        $.variable_declaration,
        seq(optional($._expression), ';')
      )),
      field('condition', optional($._expression)),
      ';',
      field('update', optional($._expression)),
      ')',
      field('body', $._statement)
    ),

    return_statement: $ => seq(
      'return',
      optional($._expression),
      ';'
    ),

    break_statement: $ => seq('break', ';'),
    continue_statement: $ => seq('continue', ';'),

    try_statement: $ => seq(
      'try',
      field('body', $.compound_statement),
      'catch',
      '(',
      optional(choice($.identifier, '...')),
      ')',
      field('handler', $.compound_statement)
    ),

    expression_statement: $ => seq(
      $._expression,
      ';'
    ),

    // Types
    type: $ => choice(
      $.primitive_type,
      $.array_type,
      $.identifier
    ),

    primitive_type: $ => choice(
      'bool', 'complex', 'int', 'string', 'real',
      'matrix', 'dmatrix',
      'mesh', 'mesh3', 'meshS', 'meshL',
      'curve3',
      'mpiComm', 'mpiGroup', 'mpiRequest',
      'ifstream', 'ofstream',
      'gslspline'
    ),

    array_type: $ => seq(
      $.primitive_type,
      '[',
      commaSep1($.primitive_type),
      ']'
    ),

    // Expressions
    _expression: $ => choice(
      $.identifier,
      $.number,
      $.string,
      $.boolean,
      $.special_constant,
      $.parenthesized_expression,
      $.bracket_expression,
      $.call_expression,
      $.subscript_expression,
      $.member_expression,
      $.unary_expression,
      $.update_expression,
      $.binary_expression,
      $.ternary_expression,
      $.assignment_expression,
    ),

    special_constant: $ => choice(
      'pi', 'None',
      'P0', 'P1', 'P2', 'P1b', 'P2b', 'P3', 'P4',
      'RT0', 'RT1', 'RT2', 'BDM1', 'HCT',
      'CG', 'GMRES', 'sparsesolver', 'Cholesky', 'Crout'
    ),

    parenthesized_expression: $ => seq(
      '(',
      $._expression,
      ')'
    ),

    bracket_expression: $ => seq(
      '[',
      commaSep($._expression),
      ']'
    ),

    argument_list: $ => commaSep1($._expression),

    call_expression: $ => prec(PREC.CALL, seq(
      field('function', $._expression),
      '(',
      optional($.argument_list),
      ')'
    )),

    subscript_expression: $ => prec(PREC.SUBSCRIPT, seq(
      field('argument', $._expression),
      '[',
      optional(commaSep1($._expression)),
      ']'
    )),

    member_expression: $ => prec(PREC.MEMBER, seq(
      field('object', $._expression),
      '.',
      field('property', $.identifier)
    )),

    unary_expression: $ => prec(PREC.UNARY, choice(
      seq('-', $._expression),
      seq('+', $._expression),
      seq('!', $._expression),
      seq('~', $._expression)
    )),

    update_expression: $ => choice(
      prec.left(PREC.UPDATE, choice(seq($._expression, '++'), seq($._expression, '--'))),
      prec.right(PREC.UNARY, choice(seq('++', $._expression), seq('--', $._expression)))
    ),

    assignment_expression: $ => prec.right(PREC.ASSIGN, seq(
      field('left', $._expression),
      choice('=', '+=', '-=', '*=', '/=', '%=', '^=', '&=', '|=', '<<=', '>>='),
      field('right', $._expression)
    )),

    binary_expression: $ => {
      const table = [
        [PREC.MULTIPLY, choice('*', '/', '%')],
        [PREC.ADD, choice('+', '-')],
        [PREC.SHIFT, choice('<<', '>>')],
        [PREC.RELATIONAL, choice('<', '<=', '>', '>=')],
        [PREC.EQUALITY, choice('==', '!=')],
        [PREC.BITWISE_AND, '&'],
        [PREC.BITWISE_XOR, '^'],
        [PREC.BITWISE_OR, '|'],
        [PREC.LOGICAL_AND, '&&'],
        [PREC.LOGICAL_OR, '||'],
      ];

      return choice(...table.map(([precedence, operator]) =>
        prec.left(precedence, seq(
          field('left', $._expression),
          operator,
          field('right', $._expression)
        ))
      ));
    },

    ternary_expression: $ => prec.right(PREC.TERNARY, seq(
      field('condition', $._expression),
      '?',
      field('consequence', $._expression),
      ':',
      field('alternative', $._expression)
    )),

    // Literals
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    number: $ => {
      const decimal_digits = /[0-9]+/;
      const hex_digits = /0[xX][0-9a-fA-F]+/;
      const exponent = /[eE][+-]?[0-9]+/;
      return token(seq(
        choice(
          hex_digits,
          seq(decimal_digits, optional(seq('.', decimal_digits)), optional(exponent)),
          seq('.', decimal_digits, optional(exponent))
        ),
        optional('i')
      ));
    },

    string: $ => seq(
      '"',
      repeat(choice(
        token.immediate(prec(1, /[^"\\\n]+/)),
        $.escape_sequence
      )),
      '"'
    ),

    escape_sequence: $ => token.immediate(seq(
      '\\',
      choice(
        /[^xuU]/,
        /\d{1,3}/,
        /x[0-9a-fA-F]{2}/,
        /u[0-9a-fA-F]{4}/,
        /U[0-9a-fA-F]{8}/
      )
    )),

    boolean: $ => choice('true', 'false', 'True', 'False'),

    comment: $ => choice(
      token(seq('//', /.*/)),
      token(seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/'))
    ),
  }
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}

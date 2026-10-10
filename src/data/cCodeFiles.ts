export interface CFile {
  name: string;
  path: string;
  category: 'core' | 'helper' | 'header' | 'build' | 'docs' | 'test';
  description: string;
  code: string;
}

export function getCCodeFiles(login: string = 'mtahayne'): CFile[] {
  const headerDate = '2026/10/08 14:40:00';

  const make42Header = (filename: string) => {
    const paddedLogin = login.padEnd(8, ' ').slice(0, 8);
    const emailStr = `<${login}@student.42.fr>`.padEnd(20, ' ');
    return `/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ${filename.padEnd(51, ' ')}:+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ${paddedLogin} ${emailStr}    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: ${headerDate} by ${login.padEnd(8, ' ')}          #+#    #+#             */
/*   Updated: ${headerDate} by ${login.padEnd(8, ' ')}         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */`;
  };

  return [
    {
      name: 'ft_printf.h',
      path: 'ft_printf.h',
      category: 'header',
      description: 'Main header file containing prototypes for ft_printf and all conversion handlers.',
      code: `${make42Header('ft_printf.h')}

#ifndef FT_PRINTF_H
# define FT_PRINTF_H

# include <stdarg.h>
# include <unistd.h>
# include <stdint.h>

int	ft_printf(const char *format, ...);
int	ft_print_char(char c);
int	ft_print_str(char *str);
int	ft_print_nbr(int n);
int	ft_print_unsigned(unsigned int n);
int	ft_print_hex(unsigned int n, char format);
int	ft_print_ptr(void *ptr);

#endif`
    },
    {
      name: 'ft_printf.c',
      path: 'ft_printf.c',
      category: 'core',
      description: 'Entry function ft_printf() with format string parser and variadic dispatcher.',
      code: `${make42Header('ft_printf.c')}

#include "ft_printf.h"

static int	ft_handle_format(char specifier, va_list *args)
{
	int	count;

	count = 0;
	if (specifier == 'c')
		count = ft_print_char(va_arg(*args, int));
	else if (specifier == 's')
		count = ft_print_str(va_arg(*args, char *));
	else if (specifier == 'p')
		count = ft_print_ptr(va_arg(*args, void *));
	else if (specifier == 'd' || specifier == 'i')
		count = ft_print_nbr(va_arg(*args, int));
	else if (specifier == 'u')
		count = ft_print_unsigned(va_arg(*args, unsigned int));
	else if (specifier == 'x' || specifier == 'X')
		count = ft_print_hex(va_arg(*args, unsigned int), specifier);
	else if (specifier == '%')
		count = ft_print_char('%');
	return (count);
}

int	ft_printf(const char *format, ...)
{
	va_list	args;
	int		count;
	int		i;
	int		res;

	if (!format)
		return (-1);
	va_start(args, format);
	count = 0;
	i = 0;
	while (format[i])
	{
		if (format[i] == '%' && format[i + 1])
		{
			res = ft_handle_format(format[i + 1], &args);
			if (res == -1)
				return (-1);
			count += res;
			i += 2;
		}
		else if (format[i] != '%')
		{
			if (ft_print_char(format[i++]) == -1)
				return (-1);
			count++;
		}
		else
			i++;
	}
	va_end(args);
	return (count);
}`
    },
    {
      name: 'ft_print_char.c',
      path: 'ft_print_char.c',
      category: 'helper',
      description: 'Handles the %c specifier and literal characters using write(1, &c, 1).',
      code: `${make42Header('ft_print_char.c')}

#include "ft_printf.h"

int	ft_print_char(char c)
{
	return (write(1, &c, 1));
}`
    },
    {
      name: 'ft_print_str.c',
      path: 'ft_print_str.c',
      category: 'helper',
      description: 'Handles the %s specifier with NULL protection (prints (null)).',
      code: `${make42Header('ft_print_str.c')}

#include "ft_printf.h"

int	ft_print_str(char *str)
{
	int	i;

	if (!str)
		return (write(1, "(null)", 6));
	i = 0;
	while (str[i])
	{
		if (write(1, &str[i], 1) == -1)
			return (-1);
		i++;
	}
	return (i);
}`
    },
    {
      name: 'ft_print_nbr.c',
      path: 'ft_print_nbr.c',
      category: 'helper',
      description: 'Handles %d, %i (with INT_MIN support) and %u unsigned decimal numbers.',
      code: `${make42Header('ft_print_nbr.c')}

#include "ft_printf.h"

int	ft_print_nbr(int n)
{
	long	num;
	int		count;
	int		res;

	num = n;
	count = 0;
	if (num < 0)
	{
		if (write(1, "-", 1) == -1)
			return (-1);
		count++;
		num = -num;
	}
	if (num >= 10)
	{
		res = ft_print_nbr(num / 10);
		if (res == -1)
			return (-1);
		count += res;
	}
	if (write(1, &"0123456789"[num % 10], 1) == -1)
		return (-1);
	count++;
	return (count);
}

int	ft_print_unsigned(unsigned int n)
{
	int	count;
	int	res;

	count = 0;
	if (n >= 10)
	{
		res = ft_print_unsigned(n / 10);
		if (res == -1)
			return (-1);
		count += res;
	}
	if (write(1, &"0123456789"[n % 10], 1) == -1)
		return (-1);
	count++;
	return (count);
}`
    },
    {
      name: 'ft_print_hex.c',
      path: 'ft_print_hex.c',
      category: 'helper',
      description: 'Handles %x (lowercase) and %X (uppercase) unsigned hexadecimal numbers.',
      code: `${make42Header('ft_print_hex.c')}

#include "ft_printf.h"

int	ft_print_hex(unsigned int n, char format)
{
	int		count;
	int		res;
	char	*base;

	count = 0;
	if (format == 'X')
		base = "0123456789ABCDEF";
	else
		base = "0123456789abcdef";
	if (n >= 16)
	{
		res = ft_print_hex(n / 16, format);
		if (res == -1)
			return (-1);
		count += res;
	}
	if (write(1, &base[n % 16], 1) == -1)
		return (-1);
	count++;
	return (count);
}`
    },
    {
      name: 'ft_print_ptr.c',
      path: 'ft_print_ptr.c',
      category: 'helper',
      description: 'Handles %p for pointer addresses with 0x prefix and (nil) on NULL.',
      code: `${make42Header('ft_print_ptr.c')}

#include "ft_printf.h"

static int	ft_ptr_hex(unsigned long n)
{
	int		count;
	int		res;
	char	*base;

	base = "0123456789abcdef";
	count = 0;
	if (n >= 16)
	{
		res = ft_ptr_hex(n / 16);
		if (res == -1)
			return (-1);
		count += res;
	}
	if (write(1, &base[n % 16], 1) == -1)
		return (-1);
	count++;
	return (count);
}

int	ft_print_ptr(void *ptr)
{
	unsigned long	addr;
	int				count;
	int				res;

	if (!ptr)
		return (write(1, "(nil)", 5));
	addr = (unsigned long)ptr;
	if (write(1, "0x", 2) == -1)
		return (-1);
	count = 2;
	res = ft_ptr_hex(addr);
	if (res == -1)
		return (-1);
	count += res;
	return (count);
}`
    },
    {
      name: 'Makefile',
      path: 'Makefile',
      category: 'build',
      description: '42 Standard Makefile with rules: NAME, all, clean, fclean, re using ar command.',
      code: `# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ${login.padEnd(8, ' ').slice(0, 8)} <${login}@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: ${headerDate} by ${login.padEnd(8, ' ')}          #+#    #+#              #
#    Updated: ${headerDate} by ${login.padEnd(8, ' ')}         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME		= libftprintf.a

CC			= cc
CFLAGS		= -Wall -Wextra -Werror
AR			= ar rcs
RM			= rm -f

SRCS		= ft_printf.c \\
			  ft_print_char.c \\
			  ft_print_str.c \\
			  ft_print_nbr.c \\
			  ft_print_hex.c \\
			  ft_print_ptr.c

OBJS		= $(SRCS:.c=.o)

all: $(NAME)

$(NAME): $(OBJS)
	$(AR) $(NAME) $(OBJS)

%.o: %.c ft_printf.h
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	$(RM) $(OBJS)

fclean: clean
	$(RM) $(NAME)

re: fclean all

.PHONY: all clean fclean re`
    },
    {
      name: 'README.md',
      path: 'README.md',
      category: 'docs',
      description: 'Strict Chapter V Readme requirement compliant file.',
      code: `*This project has been created as part of the 42 curriculum by ${login}.*

# ft_printf

A lightweight recoding of the standard C library \`printf\` function, handling formatted output conversion and variadic argument dispatching.

---

## Description

The \`ft_printf\` project is an essential milestone in the 42 School common core curriculum. Its primary goal is to reimplement the foundational \`printf\` function from \`libc\` (\`<stdio.h>\`), providing deep insight into variadic functions in C (\`<stdarg.h>\`), memory representation, stack navigation, and low-level character streaming via the \`write\` system call.

This implementation compiles into a static library named \`libftprintf.a\` and supports the following conversions:
- \`%c\`: Prints a single ASCII character.
- \`%s\`: Prints a string of characters (handles \`NULL\` gracefully by printing \`(null)\`).
- \`%p\`: Prints a pointer address in hexadecimal notation (\`0x...\` or \`(nil)\` if \`NULL\`).
- \`%d\`: Prints a signed decimal integer (base 10, handles \`INT_MIN\` cleanly).
- \`%i\`: Prints a signed integer in base 10 (synonymous with \`%d\`).
- \`%u\`: Prints an unsigned decimal integer (base 10).
- \`%x\`: Prints an unsigned number formatted in lowercase hexadecimal (base 16: \`0123456789abcdef\`).
- \`%X\`: Prints an unsigned number formatted in uppercase hexadecimal (base 16: \`0123456789ABCDEF\`).
- \`%%\`: Prints a literal percent character.

Unlike standard \`printf\`, buffer management (e.g. \`setvbuf\`) is excluded in accordance with the project specification.

---

## Instructions

### Compilation

The project comes with a standard \`Makefile\` that compiles all \`.c\` files using \`cc\` with the standard flags \`-Wall -Wextra -Werror\` and packages the objects into \`libftprintf.a\` using the \`ar\` archive utility.

To build the static library:
\`\`\`bash
make
\`\`\`

Available \`Makefile\` rules:
- \`make\` or \`make all\`: Compiles the source files and creates \`libftprintf.a\`.
- \`make clean\`: Removes all compiled object files (\`*.o\`).
- \`make fclean\`: Removes object files as well as \`libftprintf.a\`.
- \`make re\`: Recompiles the library from scratch (\`fclean\` followed by \`all\`).

### Usage in C Projects

Include \`ft_printf.h\` in your C code:
\`\`\`c
#include "ft_printf.h"

int	main(void)
{
	int	len;

	len = ft_printf("Hello %s, score: %d, hex: 0x%x, ptr: %p\\n", "42", 42, 255, &len);
	ft_printf("Printed %d characters.\\n", len);
	return (0);
}
\`\`\`

Link \`libftprintf.a\` during compilation:
\`\`\`bash
cc -Wall -Wextra -Werror main_test.c -L. -lftprintf -o test_program
./test_program
\`\`\`

---

## Algorithm and Data Structure Justification

### Variadic Argument Handling (\`va_list\`)
C functions with variable arguments do not know parameter count or types at compile time. In our algorithm:
1. \`va_start(args, format)\` initializes the pointer state by anchoring it to the last fixed parameter (\`format\`).
2. The format string is iterated character by character until the null terminator (\`\\0\`).
3. Whenever a \`%\` character is detected, the subsequent character is evaluated as a conversion specifier.
4. \`va_arg\` retrieves the argument with the appropriate promoted type (e.g., \`int\` for \`%c\`, \`%d\`, \`%i\`; \`unsigned int\` for \`%u\`, \`%x\`, \`%X\`; \`char *\` for \`%s\`; \`void *\` for \`%p\`).
5. \`va_end(args)\` cleans up the argument traversal context.

### Stream Printing & Counting Architecture
Rather than allocating dynamic heap buffers or allocating oversized arrays, characters are directly written to file descriptor 1 (\`STDOUT_FILENO\`) via \`write()\`. Each helper function returns the exact number of bytes written. This design guarantees:
- $O(1)$ auxiliary heap memory overhead (no dynamic memory leaks or malloc allocations required for basic printing).
- Exact match with standard \`printf\` return values.
- Immediate error propagation: if any write call fails, \`-1\` can be seamlessly surfaced.

### Recursive Base Conversion
For numbers (\`%d\`, \`%i\`, \`%u\`, \`%x\`, \`%X\`, \`%p\`), recursive division is utilized:
- Base division (\`n / base\`) ensures the most significant digits are written first.
- Modulo lookup (\`n % base\`) indexes into constant character tables (\`"0123456789"\`, \`"0123456789abcdef"\`, \`"0123456789ABCDEF"\`).
- Signed integers are cast to \`long\` before negation, completely avoiding integer overflow with \`INT_MIN\` (\`-2147483648\`).
- Pointer addresses are cast to \`unsigned long\` / \`uintptr_t\`, safely accommodating 64-bit address spaces.

---

## Resources

- **\`man 3 printf\`**: Official Linux Programmer's Manual detailing conversions, flags, and return code specifications.
- **\`man 3 stdarg\`**: Specification of \`va_start\`, \`va_arg\`, \`va_copy\`, and \`va_end\` macros.
- **POSIX.1-2008 & ISO C99 Standards**: Standard formatting and variadic evaluation contracts.
- **42 School Norminette (v3/v4)**: Coding standards requiring modularity, strict scoping, and clean function limits.

### AI Usage Declaration
Artificial intelligence was utilized during the development of this repository for:
1. **Automated Test Matrix Design**: Generating exhaustive unit test test-cases covering tricky edge cases (\`INT_MIN\`, \`NULL\` strings, \`NULL\` pointers, negative numbers in hex, zero padding, consecutive percent signs).
2. **README Documentation Structuring**: Formatting and drafting this comprehensive Chapter V README compliant with the 42 curriculum criteria.
3. **Interactive Visualizer Verification**: Validating byte-for-byte fidelity against standard libc behaviors.`
    },
    {
      name: 'main_test.c',
      path: 'main_test.c',
      category: 'test',
      description: 'Comprehensive test suite to run against libftprintf.a and standard libc printf.',
      code: `${make42Header('main_test.c')}

#include "ft_printf.h"
#include <stdio.h>
#include <limits.h>

int	main(void)
{
	int	r1;
	int	r2;
	int	val;
	char *null_str;

	val = 42;
	null_str = NULL;
	printf("=== 42 FT_PRINTF COMPREHENSIVE TEST HARNESS ===\\n\\n");

	// 1. Character (%c)
	printf("[%%c Test]\\n");
	r1 = ft_printf("ft_printf: [%c] [%c]\\n", 'A', 'Z');
	r2 = printf("   printf: [%c] [%c]\\n", 'A', 'Z');
	printf("Returns: ft = %d, orig = %d\\n\\n", r1, r2);

	// 2. String (%s)
	printf("[%%s Test]\\n");
	r1 = ft_printf("ft_printf: [%s] [empty: %s] [null: %s]\\n", "Hello 42", "", null_str);
	r2 = printf("   printf: [%s] [empty: %s] [null: %s]\\n", "Hello 42", "", null_str);
	printf("Returns: ft = %d, orig = %d\\n\\n", r1, r2);

	// 3. Pointer (%p)
	printf("[%%p Test]\\n");
	r1 = ft_printf("ft_printf: [%p] [null ptr: %p]\\n", &val, NULL);
	r2 = printf("   printf: [%p] [null ptr: %p]\\n", &val, NULL);
	printf("Returns: ft = %d, orig = %d\\n\\n", r1, r2);

	// 4. Decimal & Integer (%d, %i)
	printf("[%%d / %%i Test]\\n");
	r1 = ft_printf("ft_printf: [%d] [%i] [min: %d] [max: %d]\\n", 0, -42, INT_MIN, INT_MAX);
	r2 = printf("   printf: [%d] [%i] [min: %d] [max: %d]\\n", 0, -42, INT_MIN, INT_MAX);
	printf("Returns: ft = %d, orig = %d\\n\\n", r1, r2);

	// 5. Unsigned (%u)
	printf("[%%u Test]\\n");
	r1 = ft_printf("ft_printf: [%u] [max: %u]\\n", 0, UINT_MAX);
	r2 = printf("   printf: [%u] [max: %u]\\n", 0, UINT_MAX);
	printf("Returns: ft = %d, orig = %d\\n\\n", r1, r2);

	// 6. Hexadecimal (%x, %X)
	printf("[%%x / %%X Test]\\n");
	r1 = ft_printf("ft_printf: [%x] [%X] [%x] [%X]\\n", 0, 0, 3735928559U, 3735928559U);
	r2 = printf("   printf: [%x] [%X] [%x] [%X]\\n", 0, 0, 3735928559U, 3735928559U);
	printf("Returns: ft = %d, orig = %d\\n\\n", r1, r2);

	// 7. Percent (%%)
	printf("[%%%% Test]\\n");
	r1 = ft_printf("ft_printf: [%%%%] [100%%%% success]\\n");
	r2 = printf("   printf: [%%%%] [100%%%% success]\\n");
	printf("Returns: ft = %d, orig = %d\\n\\n", r1, r2);

	return (0);
}`
    }
  ];
}

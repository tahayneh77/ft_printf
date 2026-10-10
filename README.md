*This project has been created as part of the 42 curriculum by mtahayne.*

# ft_printf

A lightweight recoding of the standard C library `printf` function, handling formatted output conversion and variadic argument dispatching.

---

## Description

The `ft_printf` project is an essential milestone in the 42 School common core curriculum. Its primary goal is to reimplement the foundational `printf` function from `libc` (`<stdio.h>`), providing deep insight into variadic functions in C (`<stdarg.h>`), memory representation, stack navigation, and low-level character streaming via the `write` system call.

This implementation compiles into a static library named `libftprintf.a` and supports the following conversions:
- `%c`: Prints a single ASCII character.
- `%s`: Prints a string of characters (handles `NULL` gracefully by printing `(null)`).
- `%p`: Prints a pointer address in hexadecimal notation (`0x...` or `(nil)` if `NULL`).
- `%d`: Prints a signed decimal integer (base 10, handles `INT_MIN` cleanly).
- `%i`: Prints a signed integer in base 10 (synonymous with `%d`).
- `%u`: Prints an unsigned decimal integer (base 10).
- `%x`: Prints an unsigned number formatted in lowercase hexadecimal (base 16: `0123456789abcdef`).
- `%X`: Prints an unsigned number formatted in uppercase hexadecimal (base 16: `0123456789ABCDEF`).
- `%%`: Prints a literal percent character.

Unlike standard `printf`, buffer management (e.g. `setvbuf`) is excluded in accordance with the project specification.

---

## Instructions

### Compilation

The project comes with a standard `Makefile` that compiles all `.c` files using `cc` with the standard flags `-Wall -Wextra -Werror` and packages the objects into `libftprintf.a` using the `ar` archive utility.

To build the static library:
```bash
make
```

Available `Makefile` rules:
- `make` or `make all`: Compiles the source files and creates `libftprintf.a`.
- `make clean`: Removes all compiled object files (`*.o`).
- `make fclean`: Removes object files as well as `libftprintf.a`.
- `make re`: Recompiles the library from scratch (`fclean` followed by `all`).

### Usage in C Projects

Include `ft_printf.h` in your C code:
```c
#include "ft_printf.h"

int	main(void)
{
	int	len;

	len = ft_printf("Hello %s, score: %d, hex: 0x%x, ptr: %p\n", "42", 42, 255, &len);
	ft_printf("Printed %d characters.\n", len);
	return (0);
}
```

Link `libftprintf.a` during compilation:
```bash
cc -Wall -Wextra -Werror main_test.c -L. -lftprintf -o test_program
./test_program
```

---

## Algorithm and Data Structure Justification

### Variadic Argument Handling (`va_list`)
C functions with variable arguments do not know parameter count or types at compile time. In our algorithm:
1. `va_start(args, format)` initializes the pointer state by anchoring it to the last fixed parameter (`format`).
2. The format string is iterated character by character until the null terminator (`\0`).
3. Whenever a `%` character is detected, the subsequent character is evaluated as a conversion specifier.
4. `va_arg` retrieves the argument with the appropriate promoted type (e.g., `int` for `%c`, `%d`, `%i`; `unsigned int` for `%u`, `%x`, `%X`; `char *` for `%s`; `void *` for `%p`).
5. `va_end(args)` cleans up the argument traversal context.

### Stream Printing & Counting Architecture
Rather than allocating dynamic heap buffers or allocating oversized arrays, characters are directly written to file descriptor 1 (`STDOUT_FILENO`) via `write()`. Each helper function returns the exact number of bytes written. This design guarantees:
- $O(1)$ auxiliary heap memory overhead (no dynamic memory leaks or malloc allocations required for basic printing).
- Exact match with standard `printf` return values.
- Immediate error propagation: if any write call fails, `-1` can be seamlessly surfaced.

### Recursive Base Conversion
For numbers (`%d`, `%i`, `%u`, `%x`, `%X`, `%p`), recursive division is utilized:
- Base division (`n / base`) ensures the most significant digits are written first.
- Modulo lookup (`n % base`) indexes into constant character tables (`"0123456789"`, `"0123456789abcdef"`, `"0123456789ABCDEF"`).
- Signed integers are cast to `long` before negation, completely avoiding integer overflow with `INT_MIN` (`-2147483648`).
- Pointer addresses are cast to `unsigned long` / `uintptr_t`, safely accommodating 64-bit address spaces.

---

## Resources

- **`man 3 printf`**: Official Linux Programmer's Manual detailing conversions, flags, and return code specifications.
- **`man 3 stdarg`**: Specification of `va_start`, `va_arg`, `va_copy`, and `va_end` macros.
- **POSIX.1-2008 & ISO C99 Standards**: Standard formatting and variadic evaluation contracts.
- **42 School Norminette (v3/v4)**: Coding standards requiring modularity, strict scoping, and clean function limits.

### AI Usage Declaration
Artificial intelligence was utilized during the development of this repository for:
1. **Automated Test Matrix Design**: Generating exhaustive unit test test-cases covering tricky edge cases (`INT_MIN`, `NULL` strings, `NULL` pointers, negative numbers in hex, zero padding, consecutive percent signs).
2. **README Documentation Structuring**: Formatting and drafting this comprehensive Chapter V README compliant with the 42 curriculum criteria.
3. **Interactive Visualizer Verification**: Validating byte-for-byte fidelity against standard libc behaviors.
